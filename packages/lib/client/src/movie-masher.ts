import type { 
  AssetType,
  AudioType,
  ImageType,
  StringRecord, 
  VideoType, 
  EndpointRequest,
  DecodingObject,
  DecodingObjects,
  FontType,
  AssetPromiseEvent,
} from '@moviemasher/runtime-shared'


import type { 
  ProbingData,
  ClientRawVideoAssetObject,
  ClientRawImageAssetObject,
  ClientRawAudioAssetObject,
  ClientRawAssetObject,
  ClientTextAssetObject,
  Masher,
} from '@moviemasher/lib-shared'


import { 
  AssetObject,
  AssetObjects,
  TypeFont,
} from '@moviemasher/runtime-shared'


import type {
  ComposerFormSlot,
  Content,
  Contents,
  CoreLib,
  Htmls,
  IconEvent,
  ImportEvent,
  InspectorFormSlot,
  AssetObjectEvent,
  AssetObjectsEventDetail,
  AssetObjectsParams,
  AssetTypeEvent,
  MovieMasherContext,
  SelectorFormSlot,
  OptionalContent,
  TranslationEvent,
  ViewerFormSlot,
  Icon,
  Translation,
} from './declarations.js'


import { 
  TypeAudio,
  TypeImage, TypeVideo, TypesAudible,
  isAudibleAssetType,
  SourceRaw,
  SourceText,
  TypeProbe,
} from '@moviemasher/runtime-shared'


import type { PropertyValues } from 'lit'
import { css, html } from 'lit'
import { provide } from '@lit-labs/context'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'

import { Component } from './Base/Component.js'
import { Slotted } from './Base/Slotted.js'
import { movieMasherContext } from './movie-masher-context.js'

import { 
  isDefiniteError,
  requestAudioPromise, requestFontPromise, requestImagePromise, requestVideoPromise 
} from '@moviemasher/lib-shared'
import { state } from 'lit/decorators/state.js'
import { MovieMasher } from '@moviemasher/runtime-client'

import './asset/index.js'

const FormSlotInspector: InspectorFormSlot = 'inspector'
const FormSlotViewer: ViewerFormSlot = 'viewer'
const FormSlotSelector: SelectorFormSlot = 'selector'
const FormSlotComposer: ComposerFormSlot = 'composer'

const SuffixMax: MaxSuffix = 'Max'
const SuffixExtensions: ExtensionsSuffix = 'Extensions'

type MaxSuffix = 'Max'
type ExtensionsSuffix = 'Extensions'
type ImportSuffix = MaxSuffix | ExtensionsSuffix
type ImportSuffixes = ImportSuffix[]
const SuffixesInput: ImportSuffixes = [SuffixMax, SuffixExtensions]


export type ImportType = AudioType | ImageType | VideoType | FontType
type ImportTypes = ImportType[]

const TypesImport: ImportTypes = [...TypesAudible, TypeImage, TypeFont]
const isImportType = (type: unknown): type is ImportType => {
  return TypesImport.includes(type as ImportType)
}


/**
 * @prop (String) icon - id of icon to use for viewer section
 * @cssprop --hue - component of oklch base color
 * 
 * @tag movie-masher
 */
@customElement('movie-masher')
export class MovieMasherElement extends Slotted {
  constructor() {
    super()
    this.masherContext = { 
      accept: this.accept,
      assetType: this.mediaType, 
      assetObjects: this.assetObjects,
    }
  }
  private _accept?: string
  @property({ type: String })
  get accept(): string {
    return this._accept ??= this.acceptInitialize
  }
  private get acceptInitialize(): string {
    const accept = TypesImport.flatMap(type => {
      const max = this[`${type}Max`]
      if (!max) return []

      const extensions = this[`${type}Extensions`]
      if (!extensions) return [`${type}/*`]
      
      return extensions.split(',').map(extension => 
        `${extension.startsWith('.') ? '' : '.'}${extension}`
      )
    }).join(',')
    return accept
  }
  private acceptRefresh() {
    // console.log('acceptRefresh', this._accept, this.movieMasherContext)
    delete this._accept 
    this.updateContext({ accept: this.accept })
  }

  @property({ type: String, attribute: 'audio-extensions' })
  audioExtensions = ''

  @property({ type: Number, attribute: 'audio-max' })
  audioMax = -1


  protected override content(contents: Contents): Content {
    return html`<div 
      @asset-promise='${this.assetHandler}'
      @asset-object='${this.assetObjectHandler}'
      @mediatype='${this.mediaTypeHandler}'
      @connection='${this.connectionHandler}'
      @slotted='${this.slottedHandler}'
      @toggle='${this.toggleHandler}'
      @icon='${this.iconHandler}'
      @string='${this.translationHandler}'
      @import='${this.importHandler}'
    >${contents}</div>`
  }

  protected core?: CoreLib | undefined
  private _sharedPromise?: Promise<void>
  private get sharedPromise() {
    return this._sharedPromise ||= this.sharedPromiseInitialize
  }
  private get sharedPromiseInitialize(): Promise<void> {
    return import('@moviemasher/lib-shared').then((lib: CoreLib) => {
      this.core = lib
    })
  }
  protected override defaultSlottedContent(name: string, htmls: Htmls): OptionalContent {
    this.importTags(`movie-masher-${name}-section`)
    
    switch(name) {
      case FormSlotInspector: {
        return html`<movie-masher-inspector-section
          part='${name}' slotted='${name}'
          icon='inspector'
        >${htmls}</movie-masher-inspector-section>`
      }
      case FormSlotViewer: {
        return html`<movie-masher-viewer-section 
          part='${name}' slotted='${name}'
          icon='${this.icon}'
        >${htmls}</movie-masher-viewer-section>`
      }
      case FormSlotSelector: {
        return html`<movie-masher-selector-section
          part='${name}' slotted='${name}'
          icon='browser'
        >${htmls}</movie-masher-selector-section>`
      }
      case FormSlotComposer: {
        return html`<movie-masher-composer-section
          part='${name}' slotted='${name}'
          icon='timeline'
        >${htmls}</movie-masher-composer-section>`
      }
    }
  }

  private fileMedia(file: File): Promise<AssetObject | void> {
    const { type: mimetype, size, name } = file
    const sizeInMeg = Math.ceil(size * 10 / 1024 / 1024) / 10
    const extension = name.split('.').pop()
    const type = mimetype.split('/').shift()
    if (!(extension && sizeInMeg && isImportType(type))) {
      this.error(`file ${name} of type ${mimetype} not supported`)
      return Promise.resolve()
    }

    const max = this[`${type}Max`]
    if (!max) {
      this.error(`file type ${type} is not supported`)
      return Promise.resolve()
    }
    if (max > 0) {
      if (sizeInMeg > max) {
        this.error(`file size ${sizeInMeg}MB exceeds limit of ${max}MB`)
        return Promise.resolve()
      }
    }
    const extensions = this[`${type}Extensions`]
    if (extensions) {
      const fileExtensions = extensions.split(',').map(extension => 
        extension.startsWith('.') ? extension.slice(1) : extension
      )
      if (!fileExtensions.includes(extension)) {
        this.error(`file extension ${extension} not supported`)
        return Promise.resolve()
      }
    }
    return this.fileMediaObjectPromise(file, type)
  }


  private fileMediaObjectPromise(file: File, type: ImportType): Promise<AssetObject | void> {
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
        return requestAudioPromise(request).then(orError => {
          if (isDefiniteError(orError)) return 

          const { data: loadedAudio } = orError

          const { duration } = loadedAudio
          info.duration = duration
          const object: ClientRawAudioAssetObject = { ...shared, type, loadedAudio }
          return object
        })
      }
      case TypeImage: {
        console.debug('fileMediaObjectPromise', request)

        return requestImagePromise(request).then(orError => {

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
        return requestVideoPromise(request).then(orError => {
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
        return requestFontPromise(request).then(orError => {
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
  
  @property({ type: String, attribute: 'font-extensions' })
  fontExtensions = ''

  @property({ type: Number, attribute: 'font-max' })
  fontMax = -1


  // override getUpdateComplete(): Promise<boolean> {
  //   return this.mediaObjectsFetchedPromise.then(() => {
  //     return super.getUpdateComplete().then(() => true)
  //   })
  // }
  @property({ type: String }) 
  icon = 'app'

  private iconHandler(event: IconEvent) {
    // console.log(this.constructor.name, 'iconHandler', event)
    const { detail } = event
    const { id } = detail
    if (id) detail.promise = this.iconRecordPromise.then(iconRecord => {
      const icon: Icon = {}
      const string = iconRecord[id] 
      if (string) {
        if (string[0] === '<') icon.svgString = string 
        else icon.imgUrl = string 
      }
      return icon
    })
    event.stopPropagation()
  }
  private _iconRecordPromise?: Promise<StringRecord>
  private get iconRecordPromise(): Promise<StringRecord> {
    return this._iconRecordPromise ||= this.iconRecordInitialize
  }
  private get iconRecordInitialize(): Promise<StringRecord> {
    const { iconSource: icon } = this
    const url = icon || (new URL('../json/icons.json', import.meta.url)).href
    return fetch(url).then(res => res.json())
  }

  @property({ type: String }) 
  iconSource = ''

  @property({ type: String, attribute: 'image-extensions' })
  imageExtensions = ''

  @property({ type: Number, attribute: 'image-max' })
  imageMax = -1

  private importHandler(event: ImportEvent) {
    const { detail } = event
    const { fileList } = detail
    // console.log(this.constructor.name, 'importHandler', fileList)
    const media: AssetObjects = []
    const [file, ...rest] = Array.from(fileList)
    let promise = this.fileMedia(file)
    rest.forEach(file => {
      promise = promise.then(mediaObject => {
        if (mediaObject) media.push(mediaObject)
        return this.fileMedia(file)
      })
    })
    promise.then(mediaObject => {
      if (mediaObject) media.push(mediaObject)
      return media
    }).then(mediaObjects => {
      this.importedAssetObjects = [...this.importedAssetObjects, ...mediaObjects]
    })
    event.stopPropagation()
  }

  @property({ type: Array, attribute: false })
  importedAssetObjects: AssetObjects = []

  protected masher?: Masher | undefined
  private _masherPromise?: Promise<void>
  private get masherPromise() {
    return this._masherPromise ||= this.masherPromiseInitialize
  }
  private get masherPromiseInitialize(): Promise<void> {
    return this.sharedPromise.then(() => {
      const masher = this.core!.masherInstance()
      this.masher = masher
      // TypesImport.forEach(type => {
      //   masher.eventTarget.addEventListener(`client${type}`, this.clientMediaHandler.bind(this))
      // })
    })
  }

  protected assetHandler(event: AssetPromiseEvent) {
    const { detail } = event
    const { assetObject } = detail
    // console.log(this.constructor.name, 'mediaHandler', mediaObject.label)
    detail.assetPromise = this.masherPromise.then(() => {
      const array  = MovieMasher.assetManager.define(assetObject)
      return array[0]
    })
    event.stopImmediatePropagation()
  }

  @property({ type: Array, attribute: false })
  assetObjectsFetched: AssetObjects = []

  private _assetObjects?: AssetObjects 
  @property({ type: Array, attribute: false })
  get assetObjects() {
    return this._assetObjects ||= this.assetObjectsInitialize
  }
  private get assetObjectsInitialize() {
    const { mediaType } = this
    // TODO: use exclude* properties...

    const combined = [...this.importedAssetObjects, ...this.assetObjectsFetched]
    const filtered = combined.filter(mediaObject => {
      const { type } = mediaObject
      return mediaType === type
    })

    return filtered
  }

  private assetObjectsRefresh() {
    // console.log(this.constructor.name, 'mediaObjectsRefresh', this.movieMasherContext)
    delete this._assetObjects
    this.updateContext({ assetObjects: this.assetObjects })
  }

  assetObjectsParams: AssetObjectsParams = { type: TypeImage }

  @property({ type: String }) 
  mediaSource = ''

  protected assetObjectHandler(event: AssetObjectEvent) {
    const { detail } = event
    const { id } = detail
    console.log(this.tagName, 'assetObjectHandler', id)
    detail.mediaObject = this.assetObjects.find(asset => asset.id === id)
    event.stopImmediatePropagation()
  }

  private _mediaObjectsFetchedPromise?: Promise<AssetObjects>
  private get mediaObjectsFetchedPromise(): Promise<AssetObjects> {
    return this._mediaObjectsFetchedPromise ||= this.mediaObjectsFetchedPromiseInitialize
  }
  private get mediaObjectsFetchedPromiseInitialize(): Promise<AssetObjects> {
    const { mediaSource } = this
    const url = mediaSource || (new URL('../json/media.json', import.meta.url)).href
    // console.log(this.tagName, 'mediaObjectsFetchedPromiseInitialize', url)
    return fetch(url).then(res => {
      return res.json().then(json => {
        return this.assetObjectsFetched = json //as AssetObjects
      })
    })
  }

  private mediaObjectsFetchedRefresh() {
    // console.log(this.constructor.name, 'mediaObjectsFetchedRefresh', this.movieMasherContext)

    delete this._mediaObjectsFetchedPromise

    const { assetObjectsParams: params } = this
    const detail: AssetObjectsEventDetail = { ...params, type: this.mediaType }
    const init: CustomEventInit<AssetObjectsEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    this.dispatchEvent(new CustomEvent('mediaobjects', init))

    const { promise } = detail
    const mediaObjectsPromise = promise || this.mediaObjectsFetchedPromise
    mediaObjectsPromise.then(mediaObjectsFetched => {
      // console.log(this.constructor.name, 'mediaObjectsFetchedRefresh setting mediaObjectsFetched', mediaObjectsFetched)
      this.assetObjectsFetched = mediaObjectsFetched
    })  
  }

  @property({ type: String, attribute: 'media-type' })
  mediaType: AssetType = TypeImage

  private mediaTypeHandler(event: AssetTypeEvent) {
    const { detail: mediaType } = event
    // console.log(this.constructor.name, 'mediaTypeHandler', mediaType)
    this.mediaType = mediaType
    this.updateContext({ assetType: mediaType })
  }

  @provide({ context: movieMasherContext })
  @state()
  masherContext: MovieMasherContext 

  @property({ type: Boolean }) 
  readonly = false

  override slots = [
    FormSlotViewer, 
    FormSlotSelector, 
    FormSlotInspector, 
    FormSlotComposer, 
  ]

  private toggleHandler(event: CustomEvent<string>) {
    event.stopPropagation()

    const { detail } = event
    switch (detail) {
      case 'paused': {
        this.masherPromise.then(() => {
          const { masher } = this
          if (!masher) return
          
          masher.paused = !masher.paused 
        })
        break
      }
    }
  }

  private translationHandler(event: TranslationEvent) {
    const { detail } = event
    const { id } = detail
    if (id) detail.promise = this.translationRecordPromise.then(translationRecord => {
      const string = translationRecord[id] || id
      const translation: Translation = { string }
      return translation
    })
    event.stopPropagation()
  }

  private _translationRecordPromise?: Promise<StringRecord>
  private get translationRecordPromise(): Promise<StringRecord> {
    return this._translationRecordPromise ||= this.translationRecordInitialize
  }
  private get translationRecordInitialize(): Promise<StringRecord> {
    const { translationSource: translation } = this
    const url = translation || (new URL('../json/translations.json', import.meta.url)).href
    return fetch(url).then(res => res.json())
  }

  @property({ type: String }) 
  translationSource = ''

  private updateContext(options: Partial<MovieMasherContext>) {
    const { masherContext } = this
    if (!masherContext) {
      console.warn(this.tagName, 'updateContext no movieMasherContext')
      return 
    }
    // console.log(this.tagName, 'updateContext movieMasherContext')

    this.masherContext = { ...masherContext, ...options }
  }

  @property({ type: String, attribute: 'video-extensions' })
  videoExtensions = ''
  
  @property({ type: Number, attribute: 'video-max' })
  videoMax = -1

  protected override willUpdate(values: PropertyValues<this>): void {
    if (values.has('mediaType')) {
      // console.log('willUpdate mediaType', this.mediaType)
      this.mediaObjectsFetchedRefresh()
    }
    if (values.has('assetObjectsFetched') || values.has('importedAssetObjects')) {
      // console.log('willUpdate mediaObjects dependency', this.mediaObjectsFetched.length, this.importedMediaObjects.length)
      this.assetObjectsRefresh()
    }
    const changedAccept = TypesImport.some(mediaType => (
      SuffixesInput.some(suffix => values.has(`${mediaType}${suffix}`))
    ))
    if (changedAccept) {      
      // console.log('willUpdate accept dependency')
      this.acceptRefresh()
    }
  }

  static override styles = [
    Component.cssHostFlex,
    css`
      :host {
        --icon-size: 24px;
        --button-size: 24px;
      

        --padding: 40px;
        --spacing: 20px;
        --header-height: 38px;
        --footer-height: 38px;
        
        --border-size: 1px;
        --border: var(--border-size) solid;
        --border-radius: 5px;

        --hue: 281;
        --gap: 20px;
        --areas:
          "preview media inspect"
          "compose compose inspect";
        --columns:
          calc(
            var(--viewer-width)
            + (var(--border-size) * 2)
          )
          1fr
          var(--inspector-width);
        --rows:
          calc(
            var(--viewer-height)
            + var(--header-height)
            + var(--footer-height)
          )
          1fr;

        --button-transition:
            background-color 0.25s ease-out,
            border-color 0.25s ease-out,
            color 0.25s ease-out;
        --chroma-primary: 0.085;
        /* --chroma-secondary: 0.1; */
        /* --chroma-tertiary: 0.125; */

        --lightness-back-primary: 95%;
        --lightness-back-secondary: 75%;
        --lightness-back-tertiary: 55%;

        --lightness-fore-primary: 45%;
        --lightness-fore-secondary: 35%;
        --lightness-fore-tertiary: 25%;
      

        --darkness-back-primary: 5%;
        --darkness-back-secondary: 25%;
        --darkness-back-tertiary: 30%;

        --darkness-fore-primary: 45%;
        --darkness-fore-secondary: 60%;
        --darkness-fore-tertiary: 75%;



        --viewer-aspect-ratio: 16 / 9;
        --icon-ratio: 0.25;
        --viewer-width: 480px;
        --viewer-height: 270px;
        --scrubber-height: 16px;
        --scrubber-width: 16px;
        --inspector-width: 240px;
        --track-width: 34px;
        --track-height: 60px;
        
        --drop-size: 2px;
        --progress-width: calc(2 * var(--icon-size));
        --dropping-shadow: 
          var(--drop-size) var(--drop-size) 0 0 var(--color-drop) inset,
          calc(-1 * var(--drop-size)) calc(-1 * var(--drop-size)) 0 0 var(--color-drop) inset;
        ;


        --div-pad: 20px;
        --div-space: 20px;
        --div-back: oklch(var(--lightness-back-primary) 0 0);
        --div-fore: oklch(var(--lightness-fore-primary) 0 0);

        --section-padding: 5px;
        --section-spacing: 5px;
        --section-fore: oklch(var(--lightness-fore-tertiary) 0 0);
        --section-back: oklch(var(--lightness-back-tertiary) 0 0);
          
        --label-fore: red;
        --label-back: black;

        --control-back: oklch(var(--lightness-back-secondary) 0 0);
        --control-back-disabled: var(--control-back);
        --control-back-hover: var(--control-back);
        --control-back-selected: var(--control-back);

        --control-hover-selected: oklch(var(--lightness-fore-primary) var(--chroma-primary) var(--hue));
        --control-fore-disabled: oklch(var(--lightness-fore-secondary) var(--chroma-primary) var(--hue));

        --control-fore-hover: var(--control-hover-selected);
        --control-fore-selected:var(--control-hover-selected);
        --control-fore: var(--fore-secondary);
        --control-padding: 5px;
        --control-spacing: 5px;

        --item-fore: yellow;
        --item-fore-selected: yellow;
        --item-fore-hover: yellow;
        --item-back: blue;
        --item-back-hover-selected: oklch(var(--lightness-back-primary) var(--chroma-primary) var(--hue));

        --item-back-selected: var(--item-back-hover-selected);
        --item-back-hover:  var(--item-back-hover-selected);


        --color-drop: red;


      /* --color-back-secondary: oklch(var(--lightness-back-secondary) var(--chroma-secondary) var(--hue)); */
        /* --color-back-tertiary: oklch(var(--lightness-back-tertiary) var(--chroma-tertiary) var(--hue)); */

        /* --color-fore-secondary: oklch(var(--lightness-fore-secondary) var(--chroma-secondary) var(--hue)); */
        /* --color-fore-tertiary: oklch(var(--lightness-fore-tertiary) var(--chroma-tertiary) var(--hue)); */

      }
    `,
    css`
      * {
        box-sizing: border-box;
      }
    `,
    css`
      div {
        flex-grow: 1;
        display: grid;
        gap: var(--gap);
        grid-template-areas: var(--areas);
        grid-template-columns: var(--columns);
        grid-template-rows: var(--rows);
      }
    `,

    css`
      /* 
      @media (max-width: 999px) {
        :host {
          display: block;
          grid-template-areas: "preview" "compose" "inspect" "media";
        }
      } */
      @media(prefers-color-scheme: dark) {
        :host {
          --lightness-back-primary: var(--darkness-back-primary);
          --lightness-back-secondary: var(--darkness-back-secondary);
          --lightness-back-tertiary: var(--darkness-back-tertiary);
          --lightness-fore-primary: var(--darkness-fore-primary);
          --lightness-fore-secondary: var(--darkness-fore-secondary);
          --lightness-fore-tertiary: var(--darkness-fore-tertiary);
          --color-drop: yellow;
        } 
      }
    `,
    css`
    :host {
      .panel .content {
        --padding: 20px;
        --spacing: 10px;
      }

      .panels {
        grid-area: panels;
        display: flex;
        flex-direction: column;
        gap: var(--spacing);
      }

      .panel .content .drop-box {
        pointer-events: none;
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
      }

      .panel .content.dropping .drop-box {
        box-shadow: var(--dropping-shadow);
      }


      .panel select {
        height: var(--button-size);
      }
    }

    `
  ]
}
