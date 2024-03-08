import type { ClientTextAssetObject, AssetObject, AssetObjects, DataOrError, Decoding, Decodings, DefiniteError, DropType, EndpointRequest, ListenersFunction, ProbingData, Resource, ShapeAssetObject, Sources } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup } from 'lit'
import type { OptionalContent } from '../client-types.js'
import type { ClientImporter } from '../types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { $AUDIO, $FONT, $IMAGE, $PROBE, $RAW, $RETRIEVE, $SHAPE, $TEMPORARY, $TEXT, $VIDEO, DOT, DROP_TYPES, ERROR, MIME_SVG, MOVIE_MASHER, SIZE_ZERO, errorCaught, errorPromise, idGenerateString, isAudibleType, isDefiniteError, isDropType, namedError } from '@moviemasher/shared-lib/runtime.js'
import { isClientAudio, isClientFont, isClientImage, isClientVideo, isPopulatedString } from '@moviemasher/shared-lib/utility/guard.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { copySize, sizeNotZero } from '@moviemasher/shared-lib/utility/rect.js'
import { html } from 'lit-html'
import { Component } from '../base/component.js'
import { Scroller } from '../base/component-view.js'
import { DROP_TARGET_CSS, DropTargetMixin, SizeReactiveMixin } from '../mixin/component.js'
import { eventStop } from '../module/event.js'
import { dropFile, droppingFiles } from '../utility/draganddrop.js'
import { EventImportFile, EventImporterAdd, EventImporterError, EventImporterNodeFunction } from '../module/event.js'
import { svgStringElement } from '@moviemasher/shared-lib/utility/svg.js'

const fileAssetObjectPromise = (file: File, dropType: DropType): Promise<DataOrError<AssetObject>> => {
  const { name } = file
  const nameBits = name.split(DOT)
  const extension = nameBits.pop()
  assertDefined(extension)

  const label = nameBits.join(DOT).replace(/[-._]/g, ' ')
  const request: EndpointRequest = { 
    file, objectUrl: URL.createObjectURL(file), endpoint: '' 
  }
  const type = dropType === $FONT ? extension : dropType
  const resource: Resource = { type, request }
  // we can't reliably tell if there is an audio track so we assume there is 
  // one, and catch problems if it's played before decoded
  const info: ProbingData = { extension, audible: isAudibleType(dropType) }
  const decoding: Decoding = { data: info, type: $PROBE }
  const decodings: Decodings = []
  if (dropType !== $FONT) { decodings.push(decoding) }
  const id = `${$TEMPORARY}-${crypto.randomUUID()}`
  const shared: AssetObject = { 
    type: $IMAGE, label, resources: [resource], decodings, id, source: $RAW,
  }
  return MOVIE_MASHER.promise(resource, $RETRIEVE).then(orError => {
    if (isDefiniteError(orError)) return orError

    const { response: media } = request
    switch (dropType) {
      case $AUDIO: {
        if (!isClientAudio(media)) return errorPromise(ERROR.Unimplemented, 'audio')

        const { duration } = media
        info.duration = duration
        const object: AssetObject = { ...shared, type: dropType }
        return { data: object }
      }
      case $IMAGE: {
        if (!isClientImage(media)) return errorPromise(ERROR.Unimplemented, 'image')

        const { width, height } = media
        info.width = width
        info.height = height
        const object: AssetObject = { ...shared, type: dropType }
        return { data: object }
      
      }
      case $VIDEO: {
        if (!isClientVideo(media)) return errorPromise(ERROR.Unimplemented, 'video')

        const { duration, videoWidth, clientWidth, videoHeight, clientHeight } = media
        const width = videoWidth || clientWidth
        const height = videoHeight || clientHeight
        info.duration = duration
        info.width = width
        info.height = height
        const object: AssetObject = { ...shared, type: dropType }
        return { data: object }
      }
      case $FONT: {
        if (!isClientFont(media)) return errorPromise(ERROR.Unimplemented, 'font')

        request.response = media
        const object: ClientTextAssetObject = { ...shared, source: $TEXT }
        return { data: object }
      }
    } 
  })
}

const fileAssetObject = (file: File): Promise<DataOrError<AssetObject>> => {
  const { type: mimetype, size, name } = file
  const sizeInMeg = Math.ceil(size * 10 / 1024 / 1024) / 10
  const extension = name.split('.').pop()
  const type = mimetype.split('/').shift()
  if (!(extension && sizeInMeg && isDropType(type))) {
    return errorPromise(ERROR.ImportFile)
  }
  const max = options[`${type}Max`]
  if (!max) return errorPromise(ERROR.Internal)

  if (max > 0 && sizeInMeg > max) return errorPromise(ERROR.ImportSize)
  
  const extensions = options[`${type}Extensions`]
  if (extensions) {
    const fileExtensions = extensions.split(',').map(extension => 
      extension.startsWith('.') ? extension.slice(1) : extension
    )
    if (!fileExtensions.includes(extension)) {
      return errorPromise(ERROR.ImportFile, extension)
    }
  }
  return fileAssetObjectPromise(file, type)
}


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
  const accept = DROP_TYPES.flatMap(type => {
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

export const ClientRawTag = 'movie-masher-importer-raw'

/**
 * @category Elements
 */
export class ClientRawElement extends DropTargetMixin(
  SizeReactiveMixin(Component)
) {
  override acceptsClip = false
  
  override dropValid(dataTransfer: DataTransfer | null): boolean { 
    return droppingFiles(dataTransfer)
  }

  protected async handleChange(event: DragEvent): Promise<void> {
    const input = event.currentTarget as HTMLInputElement
    const result = await this.handleFileList(input.files)
    input.value = ''
    return result
  }

  override async handleDropped(event: DragEvent): Promise<void> {
    eventStop(event)
    return this.handleFileList(event.dataTransfer?.files)
  }

  private async handleDroppedSvg(file: File): Promise<DataOrError<AssetObject>> {
    const stringOrError = await new Promise<DataOrError<string>>(resolve => {
      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => { 
        const { loaded, total } = event
        if (loaded === total ) {
          const { result: data } = reader
          if (isPopulatedString(data)) resolve({ data }) 
        }
      }
      reader.onerror = error => { resolve(errorCaught(error)) }
      reader.readAsText(file)
    }) 
    if (isDefiniteError(stringOrError)) return stringOrError
    
    const { data: string } = stringOrError

    // console.log('handleDroppedSvg', string)
    const svg = svgStringElement(string)
    if (!svg) return namedError(ERROR.ImportFile, 'svg')

    const viewBox = svg.getAttribute('viewBox')
    const size = copySize(SIZE_ZERO)
    if (viewBox) {
      const bits = viewBox.split(' ').map(string => string.trim())
      const [width, height] = bits.slice(-2).map(Number)
      size.width = width
      size.height = height
    }
    if (size.width === 0 || size.height === 0)  {
      const width = svg.getAttribute('width')
      const height = svg.getAttribute('height')
      if (width && height) {
        size.width = Number(width.trim())
        size.height = Number(height.trim())
      }
    }
    if (!sizeNotZero(size)) return namedError(ERROR.ImportFile, 'viewBox')

    const paths = [...svg.querySelectorAll('path')].map(path => {
      return path.getAttribute('d') || ''
    })
    const path = paths.filter(Boolean).join(' M 0 0 ')
    if (!path) return namedError(ERROR.ImportFile, 'path')
    const object: ShapeAssetObject = {
      label: file.name, path, type: $IMAGE, source: $SHAPE, id: idGenerateString(),
      pathWidth: size.width, pathHeight: size.height,
    }
    return { data: object }
  }


  private async handleFileList(fileList?: FileList | null): Promise<void> {
    if (!fileList?.length) return

    const assetObjects: AssetObjects = []
    const errors: DefiniteError[] = []
    for (const file of fileList) {
      if (this.sources.includes($SHAPE)) {
        if (file.type === MIME_SVG) {
          const shapeOrError = await this.handleDroppedSvg(file)
          if (isDefiniteError(shapeOrError)) {
            errors.push(shapeOrError)
            continue
          }
          assetObjects.push(shapeOrError.data)
          continue
        }
      } 
      const orError = await dropFile(file)
      if (isDefiniteError(orError)) {
        errors.push(orError)
        continue
      }
      assetObjects.push(orError.data)
    }
    assetObjects.forEach(assetObject => {
      const event = new EventImporterAdd(assetObject)

      MOVIE_MASHER.dispatchCustom(event)
      const { promise } = event.detail
      if (!promise) return
    })
    // TODO something with errors
    errors.forEach(error => {
      MOVIE_MASHER.dispatchCustom(new EventImporterError(error))
    })
  }
  
  protected override get defaultContent(): OptionalContent {
    return html`<div class='contents'>
      Drop files here or 
      <input 
        aria-label='file'
        type='file' multiple
        accept='${accept()}'
        @change='${this.handleChange}'
      ></input>
    </div>`
  }

  sources: Sources = []
  
  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Scroller.styles,
    DROP_TARGET_CSS,
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
      div.contents {
        padding: var(--pad);
      }

      div.contents > * {
        margin-right: var(--gap); 
        margin-bottom: var(--gap);
      }

      .dropping {
        box-shadow: var(--dropping-shadow);
      }
    `
  ]
}

customElements.define(ClientRawTag, ClientRawElement)

declare global {
  interface HTMLElementTagNameMap {
    [ClientRawTag]: ClientRawElement
  }
}

const RawClientImporterIcon = "<svg version='1.1' stroke='currentColor' fill='none' stroke-width='2' viewBox='0 0 24 24' stroke-linecap='round' stroke-linejoin='round' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><desc></desc><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M14 3v4a1 1 0 0 0 1 1h4'></path><path d='M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3'></path></svg>"
    
class RawClientImporter implements ClientImporter {
  private _icon?: Node

  get icon(): Node {
    return this._icon ||= svgStringElement(RawClientImporterIcon)!
  }

  id = ClientRawTag

  label = 'Raw'

  private _ui?: ClientRawElement
  ui(): Node {
    const { document } = MOVIE_MASHER.window
    this._ui ||= document.createElement(ClientRawTag)
    this._ui.sources = this.sources
    return this._ui
  }

  private sources: Sources = []
  
  static handleImportFile (event: EventImportFile) {
    const { detail } = event
    const { file } = detail
    detail.promise = fileAssetObject(file)
    event.stopPropagation()
  }

  static handleImporters(event: EventImporterNodeFunction) {
    const { detail } = event
    const { map, sources } = detail
    const { instance } = RawClientImporter
    instance.sources = sources
    map.set(instance.icon, instance.ui.bind(instance))
  }

  private static _instance?: RawClientImporter
  static get instance(): RawClientImporter {
    return this._instance ||= new RawClientImporter()
  }
}

// listen for import related events
export const ClientRawImportListeners: ListenersFunction = () => ({
  [EventImporterNodeFunction.Type]: RawClientImporter.handleImporters,
  [EventImportFile.Type]: RawClientImporter.handleImportFile,
})
