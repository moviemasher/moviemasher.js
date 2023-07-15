import type { ImportAssetObjectsEventDetail, ImportEvent, ImportEventDetail, ImportersEventDetail } from '../../declarations'
import type { ClientAudioEvent, ClientAudioEventDetail, ClientFontEvent, ClientFontEventDetail, ClientImageEvent, ClientImageEventDetail, ClientImporter, ClientRawAssetObject, ClientRawAudioAssetObject, ClientRawImageAssetObject, ClientRawVideoAssetObject, ClientTextAssetObject, ClientVideoEvent, ClientVideoEventDetail } from '@moviemasher/runtime-client'
import type { AssetObject, AssetObjects, DecodingObject, DecodingObjects, EndpointRequest, ImportType } from '@moviemasher/runtime-shared'
import type { ProbingData } from '@moviemasher/lib-shared'

import { LitElement } from 'lit-element/lit-element.js'
import { html } from 'lit-html/lit-html.js'

import { EventTypeImporters, isDefiniteError, SourceRaw, SourceText, TypeAudio, TypeFont, TypeImage, TypeProbe, TypeVideo, TypesImport, isAudibleAssetType, isImportType } from '@moviemasher/runtime-shared'
import { MovieMasher, EventTypeClientVideo, EventTypeClientImage, EventTypeClientFont, EventTypeClientAudio, EventTypeImporterChange, EventTypeImportRaw } from '@moviemasher/runtime-client'

const ClientRawElementName = 'movie-masher-client-raw'

export class ClientRawElement extends LitElement {
  protected handleChange(changeEvent: DragEvent) {
    const { files: fileList } = changeEvent.currentTarget as HTMLInputElement
    console.log(this.tagName, 'handleChange', fileList)
    if (!fileList?.length) return
    
    const detail: ImportEventDetail = { fileList }
    const event = new CustomEvent(EventTypeImportRaw, { detail })
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = detail
    if (!promise) return

    promise.then((assetObjects: AssetObjects) => {
      const detail: ImportAssetObjectsEventDetail = { assetObjects }
      const event = new CustomEvent(EventTypeImporterChange, { detail })
      MovieMasher.eventDispatcher.dispatch(event)
    })
  }

  override render(): unknown {
    return html`<input type='file' multiple
      accept='${accept()}'
      @change='${this.handleChange}'
    ></input>`
  }
}

// register web component as custom element
customElements.define(ClientRawElementName, ClientRawElement)

declare global {
  interface HTMLElementTagNameMap {
    [ClientRawElementName]: ClientRawElement
  }
}

class ClientRawImporter implements ClientImporter {
  id = ClientRawElementName
  label = 'Raw'

  get icon(): Node {
    const cleaned = "<svg version='1.1' stroke='currentColor' fill='none' stroke-width='2' viewBox='0 0 24 24' stroke-linecap='round' stroke-linejoin='round' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><desc></desc><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M14 3v4a1 1 0 0 0 1 1h4'></path><path d='M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3'></path></svg>"
    const parser = new DOMParser()
    const document = parser.parseFromString(cleaned, 'image/svg+xml')
    const [firstChild] = document.children
    return firstChild
  }

  private _ui?: ClientRawElement
  get ui(): Node {
    console.log(this.id, 'ui')
    return this._ui ||= document.createElement(ClientRawElementName)
  }
}
const clientRawImporter = new ClientRawImporter()

// listen for importers event
MovieMasher.eventDispatcher.addDispatchListener<ImportersEventDetail>(EventTypeImporters, event => {
  const { detail } = event
  const { importers } = detail
  importers.push(clientRawImporter)
})


const options = {
  audioExtensions: '',
  audioMax: -1,
  fontExtensions: '',
  fontMax: -1,
  imageExtensions: '',
  imageMax: -1,
  videoExtensions: '',
  videoMax: -1,
}

const accept = (): string => {
  const accept = TypesImport.flatMap(type => {
    const max = options[`${type}Max`]
    if (!max) return []

    const extensions = options[`${type}Extensions`]
    if (!extensions) return [`${type}/*`]
    
    return extensions.split(',').map(extension => 
      `${extension.startsWith('.') ? '' : '.'}${extension}`
    )
  }).join(',')
  return accept
}

const fileAssetObjectPromise = (file: File, type: ImportType): Promise<AssetObject | void> => {
  const { name: label } = file
  const request: EndpointRequest = { response: file }

  // we can't reliably tell if there is an audio track so we assume there is 
  // one, and catch problems if it's played before decoded
  const info: ProbingData = {
    audible: isAudibleAssetType(type)// TypesAudible.includes(type) 
  }
  const decoding: DecodingObject = { data: info, type: TypeProbe }
  const decodings: DecodingObjects = [decoding]
  const id = `temporary-${crypto.randomUUID()}`
  const shared: ClientRawAssetObject = { 
    type: TypeImage, label, request, decodings, id, source: SourceRaw 
  }

  switch (type) {
    case TypeAudio: {
      const detail: ClientAudioEventDetail = { request }
      const event: ClientAudioEvent = new CustomEvent(EventTypeClientAudio, { detail })
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = detail
      return promise!.then(orError => {
        if (isDefiniteError(orError)) return 

        const { data: loadedAudio } = orError

        const { duration } = loadedAudio
        info.duration = duration
        const object: ClientRawAudioAssetObject = { ...shared, type, loadedAudio }
        return object
      })
    }
    case TypeImage: {
      const detail: ClientImageEventDetail = { request }
      const event: ClientImageEvent = new CustomEvent(EventTypeClientImage, { detail })
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = detail
      return promise!.then(orError => {

        if (isDefiniteError(orError)) return 

        const { data: image } = orError


        const { width, height } = image
        info.width = width
        info.height = height
        const object: ClientRawImageAssetObject = { ...shared, type, loadedImage: image }
        console.log('object', object)
        return object
      })
    }
    case TypeVideo: {
      const detail: ClientVideoEventDetail = { request }
      const event: ClientVideoEvent = new CustomEvent(EventTypeClientVideo, { detail })
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = detail
      return promise!.then(orError => {
        if (isDefiniteError(orError)) return 

        const { data: video } = orError

        const { duration, videoWidth, clientWidth, videoHeight, clientHeight } = video
        const width = videoWidth || clientWidth
        const height = videoHeight || clientHeight
        info.duration = duration
        info.width = width
        info.height = height
        const object: ClientRawVideoAssetObject = { ...shared, type, loadedVideo: video }
        return object
      })
    }
    case TypeFont: {
      const detail: ClientFontEventDetail = { request }
      const event: ClientFontEvent = new CustomEvent(EventTypeClientFont, { detail })
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = detail
      return promise!.then(orError => {
        if (isDefiniteError(orError)) return 

        const { data: font } = orError
        const object: ClientTextAssetObject = { 
          ...shared, source: SourceText, loadedFont: font 
        }
        return object
      })
    }
  } 
}

const fileMedia = (file: File): Promise<AssetObject | void> => {
  const { type: mimetype, size, name } = file
  const sizeInMeg = Math.ceil(size * 10 / 1024 / 1024) / 10
  const extension = name.split('.').pop()
  const type = mimetype.split('/').shift()
  if (!(extension && sizeInMeg && isImportType(type))) {
    // this.error(`file ${name} of type ${mimetype} not supported`)
    return Promise.resolve()
  }

  const max = options[`${type}Max`]
  if (!max) {
    // this.error(`file type ${type} is not supported`)
    return Promise.resolve()
  }
  if (max > 0) {
    if (sizeInMeg > max) {
      // this.error(`file size ${sizeInMeg}MB exceeds limit of ${max}MB`)
      return Promise.resolve()
    }
  }
  const extensions = options[`${type}Extensions`]
  if (extensions) {
    const fileExtensions = extensions.split(',').map(extension => 
      extension.startsWith('.') ? extension.slice(1) : extension
    )
    if (!fileExtensions.includes(extension)) {
      // this.error(`file extension ${extension} not supported`)
      return Promise.resolve()
    }
  }
  return fileAssetObjectPromise(file, type)
}

const handleImport = (event: ImportEvent) => {
  const { detail } = event
  const { fileList } = detail
  const media: AssetObjects = []
  const [file, ...rest] = Array.from(fileList)
  let promise = fileMedia(file)
  rest.forEach(file => {
    promise = promise.then(mediaObject => {
      if (mediaObject) media.push(mediaObject)
      return fileMedia(file)
    })
  })
  detail.promise = promise.then(mediaObject => {
    if (mediaObject) media.push(mediaObject)
    return media
  })
  event.stopPropagation()
}

// listen for import event
MovieMasher.eventDispatcher.addDispatchListener(EventTypeImportRaw, handleImport)
