import type { ProbingData } from '@moviemasher/runtime-shared'
import type { ClientImporter, ClientRawAssetObject, ClientRawAudioAssetObject, ClientRawImageAssetObject, ClientRawVideoAssetObject, ClientTextAssetObject, ClientMediaRequest } from '@moviemasher/runtime-client'
import type { AssetObject, AssetObjects, Decoding, Decodings, ImportType } from '@moviemasher/runtime-shared'
import type { CSSResultGroup } from 'lit'

import { css } from '@lit/reactive-element/css-tag.js'
import { IdTemporaryPrefix } from '@moviemasher/lib-shared'
import { EventClientAudioPromise, EventClientFontPromise, EventClientImagePromise, EventClientVideoPromise, EventImport, EventImporterAdd, EventImporters, MovieMasher, eventStop } from '@moviemasher/runtime-client'
import { RAW, TEXT, AUDIO, FONT, IMAGE, PROBE, VIDEO, IMPORT_TYPES, isAudibleAssetType, isDefiniteError, isImportType } from '@moviemasher/runtime-shared'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../../Base/Component.js'
import { DropTargetCss, DropTargetMixin } from '../../Base/DropTargetMixin.js'
import { Scroller } from '../../Base/Scroller.js'
import { SizeReactiveMixin } from '../../Base/SizeReactiveMixin.js'
import { dropRawFiles, droppingFiles } from '../../utility/draganddrop.js'

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
  const accept = IMPORT_TYPES.flatMap(type => {
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

const ClientRawTag = 'movie-masher-client-raw'

const ClientRawSizeReactive = SizeReactiveMixin(Scroller)
const ClientRawDropTarget = DropTargetMixin(ClientRawSizeReactive)
export class ClientRawElement extends ClientRawDropTarget {
  override acceptsClip = false
  
  override dropValid(dataTransfer: DataTransfer | null): boolean { 
    return droppingFiles(dataTransfer)
  }

  protected handleChange(changeEvent: DragEvent) {
    const input = changeEvent.currentTarget as HTMLInputElement
    const { files: fileList } = input
    // console.log(this.tagName, 'handleChange', fileList)
    if (!fileList?.length) return
    
    const event = new EventImport(fileList)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return

    promise.then((assetObjects) => {
      // console.log(this.tagName, 'handleChange', !!input)
      input.value = ''
      MovieMasher.eventDispatcher.dispatch(new EventImporterAdd(assetObjects))
    })
  }

  override handleDropped(event: DragEvent): void {
    eventStop(event)

    const { dataTransfer } = event 
    if (!dataTransfer) return
  
    const { files } = dataTransfer
    const promise = dropRawFiles(files)
    promise?.then(assetObjects => { 
      MovieMasher.eventDispatcher.dispatch(new EventImporterAdd(assetObjects))
    })
  }
  
  override render(): unknown {
    return html`<div class='content'>
      Drop files here or 
      <input 
        aria-label='file'
        type='file' multiple
        accept='${accept()}'
        @change='${this.handleChange}'
      ></input>
    </div>`
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Scroller.styles,
    DropTargetCss,
    css`
      :host {
        --ratio-preview-selector: var(--ratio-preview, 0.25);
        --pad: var(--pad-content);
        --gap: var(--gap-content);
      }
      div.root {
        display: block;
        overflow-y: auto;
      }
      div.content {
        font-size: 0;
        padding: var(--pad);
      }

      div.content > * {
        margin-right: var(--gap); 
        margin-bottom: var(--gap);
      }

      .dropping {
        box-shadow: var(--dropping-shadow);
      }
    `
  ]
}

// register web component as custom element
customElements.define(ClientRawTag, ClientRawElement)

declare global {
  interface HTMLElementTagNameMap {
    [ClientRawTag]: ClientRawElement
  }
}

const fileAssetObjectPromise = (file: File, type: ImportType): Promise<AssetObject | void> => {
  const { name: label } = file
  const request: ClientMediaRequest = { file, objectUrl: URL.createObjectURL(file), endpoint: '' }

  // we can't reliably tell if there is an audio track so we assume there is 
  // one, and catch problems if it's played before decoded
  const info: ProbingData = { audible: isAudibleAssetType(type) }
  const decoding: Decoding = { id: '', data: info, type: PROBE }
  const decodings: Decodings = [decoding]
  const id = `${IdTemporaryPrefix}-${crypto.randomUUID()}`
  const shared: ClientRawAssetObject = { 
    type: IMAGE, label, request, decodings, id, source: RAW,
  }
 
  switch (type) {
    case AUDIO: {
      const event = new EventClientAudioPromise(request)
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      return promise!.then(orError => {
        if (isDefiniteError(orError)) return 

        const { data: loadedAudio } = orError
        request.response = loadedAudio
        const { duration } = loadedAudio
        info.duration = duration
        const object: ClientRawAudioAssetObject = { ...shared, type, loadedAudio }
        return object
      })
    }
    case IMAGE: {
      const event = new EventClientImagePromise(request)
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      return promise!.then(orError => {
        if (isDefiniteError(orError)) return 

        const { data: image } = orError
        request.response = image
        const { width, height } = image
        info.width = width
        info.height = height
        const object: ClientRawImageAssetObject = { ...shared, type, loadedImage: image }
        // console.log('object', object)
        return object
      })
    }
    case VIDEO: {
      const event = new EventClientVideoPromise(request)
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      return promise!.then(orError => {
        if (isDefiniteError(orError)) return 

        const { data: video } = orError
        request.response = video
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
    case FONT: {
      const event = new EventClientFontPromise(request)
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      return promise!.then(orError => {
        if (isDefiniteError(orError)) return 

        const { data: font } = orError
        request.response = font
        const object: ClientTextAssetObject = { 
          ...shared, source: TEXT, loadedFont: font 
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
    return Promise.resolve()
  }

  const max = options[`${type}Max`]
  if (!max) {
    return Promise.resolve()
  }
  if (max > 0) {
    if (sizeInMeg > max) {
      return Promise.resolve()
    }
  }
  const extensions = options[`${type}Extensions`]
  if (extensions) {
    const fileExtensions = extensions.split(',').map(extension => 
      extension.startsWith('.') ? extension.slice(1) : extension
    )
    if (!fileExtensions.includes(extension)) {
      return Promise.resolve()
    }
  }
  return fileAssetObjectPromise(file, type)
}

class RawClientImporter implements ClientImporter {
  get icon(): Node {
    const cleaned = "<svg version='1.1' stroke='currentColor' fill='none' stroke-width='2' viewBox='0 0 24 24' stroke-linecap='round' stroke-linejoin='round' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><desc></desc><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M14 3v4a1 1 0 0 0 1 1h4'></path><path d='M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3'></path></svg>"
    const parser = new DOMParser()
    const document = parser.parseFromString(cleaned, 'image/svg+xml')
    const [firstChild] = document.children
    return firstChild
  }

  id = ClientRawTag

  label = 'Raw'

  private _ui?: ClientRawElement
  get ui(): Node {
    // console.log(this.id, 'ui')
    return this._ui ||= document.createElement(ClientRawTag)
  }

  static handleImport (event: EventImport) {
    const { detail } = event
    const { fileList } = detail
    const objects: AssetObjects = []
    const [file, ...rest] = Array.from(fileList)
    let promise = fileMedia(file)
    rest.forEach(file => {
      promise = promise.then(object => {
        if (object) objects.push(object)
        return fileMedia(file)
      })
    })
    detail.promise = promise.then(object => {
      if (object) objects.push(object)

      return objects
    })
    event.stopPropagation()
  }

  static handleImporters(event: EventImporters) {
    const { detail } = event
    const { importers } = detail
    importers.push(RawClientImporter.instance)
  }

  private static _instance?: RawClientImporter
  static get instance(): RawClientImporter {
    return this._instance ||= new RawClientImporter()
  }
}

// listen for import related events
export const ClientRawImportListeners = () => ({
  [EventImporters.Type]: RawClientImporter.handleImporters,
  [EventImport.Type]: RawClientImporter.handleImport,
})


