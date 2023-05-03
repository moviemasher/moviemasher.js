import type {
  AudioMediaObject,
  AudioType,
  ClientAudioEvent,
  ClientFontEvent,
  ClientImageEvent,
  
  ClientVideoEvent,
  
  DecodingObject,
  DecodingObjects,
  EndpointRequest,
  FontMediaObject,
  FontType,
  ImageMediaObject,
  ImageType,
  Masher,
  MediaObject,
  MediaObjects,
  MediaType, 
  ProbeType,
  ProbingData,
  StringRecord,
  VideoMediaObject,
  VideoType
} from '@moviemasher/lib-core'

import type {
  Icon, Translation,
} from '@moviemasher/client-core'

import type {
  ComposerFormSlot,
  Content,
  Contents,
  CoreLib,
  Htmls,
  IconEvent,
  ImportEvent,
  InspectorFormSlot,
  MediaObjectEvent,
  MediaObjectsEventDetail,
  MediaObjectsParams,
  MediaTypeEvent,
  MovieMasher,
  SelectorFormSlot,
  OptionalContent,
  TranslationEvent,
  ViewerFormSlot,
  MediaEvent,
} from './declarations.js'

import { PropertyValues, css, html } from 'lit'
import { provide } from '@lit-labs/context'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'

import { Component } from './Base/Component.js'
import { Slotted } from './Base/Slotted.js'
import { movieMasherContext } from './movie-masher-context.js'

import { requestAudioPromise, requestFontPromise, requestImagePromise, requestVideoPromise } from './request/request.js'

const FormSlotInspector: InspectorFormSlot = 'inspector'
const FormSlotViewer: ViewerFormSlot = 'viewer'
const FormSlotSelector: SelectorFormSlot = 'selector'
const FormSlotComposer: ComposerFormSlot = 'composer'

const TypeAudio: AudioType = 'audio'
const TypeImage: ImageType = 'image'
const TypeProbe: ProbeType = 'probe'
const TypeVideo: VideoType = 'video'
const TypeFont: FontType = 'font'
// const TypeMash: MashType = 'mash'
// const TypeEffect: EffectType = 'effect'

const SuffixMax: MaxSuffix = 'Max'
const SuffixExtensions: ExtensionsSuffix = 'Extensions'

type MaxSuffix = 'Max'
type ExtensionsSuffix = 'Extensions'
type ImportSuffix = MaxSuffix | ExtensionsSuffix
type ImportSuffixes = ImportSuffix[]
const SuffixesInput: ImportSuffixes = [SuffixMax, SuffixExtensions]

// type MediaType = AudioType | ImageType | VideoType | MashType | EffectType
// type MediaTypes = MediaType[]
type ImportType = AudioType | ImageType | VideoType | FontType
type ImportTypes = ImportType[]

const AudibleTypes: ImportTypes = [TypeAudio, TypeVideo]
const TypesImport: ImportTypes = [...AudibleTypes, TypeImage, TypeFont]
// const TypesMedia: MediaTypes = [...TypesImport, TypeMash, TypeEffect]
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
export class MovieMasherElement extends Slotted implements MovieMasher {
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

  private clientAudioPromise(event: ClientAudioEvent): void {
    const { detail } = event
    const { request } = detail
    console.log('clientAudioPromise', request)
    detail.promise = requestAudioPromise(request)
      .then(data =>  {
        request.response = data
        return { data}
      })
      .catch(error => ({ error }))
  }
  private clientImagePromise(event: ClientImageEvent): void {
    const { detail } = event
    const { request } = detail
    console.log('clientImagePromise', request)
    detail.promise = requestImagePromise(request)
      .then(data =>  {
        request.response = data
        return { data}
      })
      .catch(error => ({ error }))
  }
  private clientVideoPromise(event: ClientVideoEvent): void {
    const { detail } = event
    const { request } = detail
    console.log('clientVideoPromise', request)
    detail.promise = requestVideoPromise(request)
      .then(data =>  {
        request.response = data
        return { data}
      })
      .catch(error => ({ error }))
  }

  private clientFontPromise(event: ClientFontEvent): void {
    const { detail } = event
    const { request } = detail
    console.log('clientFontPromise', request)
    detail.promise = requestFontPromise(request)
      .then(data =>  {
        request.response = data
        return { data}
      })
      .catch(error => ({ error }))
  }

  private clientMediaHandler(event: Event) {
    if (event instanceof CustomEvent) {
      const { type } = event
      console.log(this.constructor.name, 'clientMediaHandler', type)

      switch(type) {
        case 'clientaudio': return this.clientAudioPromise(event)
        case 'clientimage': return this.clientImagePromise(event)
        case 'clientvideo': return this.clientVideoPromise(event)
        case 'clientfont': return this.clientFontPromise(event)
      }
    } 
  }

  protected override content(contents: Contents): Content {
    return html`<div 
      @media='${this.mediaHandler}'
      @mediaobject='${this.mediaObjectHandler}'
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
  private _corePromise?: Promise<void>
  private get corePromise() {
    return this._corePromise ||= this.corePromiseInitialize
  }
  private get corePromiseInitialize(): Promise<void> {
    return import('@moviemasher/lib-core').then((lib: CoreLib) => {
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

  private fileMedia(file: File): Promise<MediaObject | void> {
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


  private fileMediaObjectPromise(file: File, type: ImportType): Promise<MediaObject | void> {
    const { name: label } = file
    const request: EndpointRequest = { response: file }

    // we can't reliably tell if there is an audio track so we assume there is 
    // one, and catch problems if it's played before decoded
    const info: ProbingData = {
      audible: AudibleTypes.includes(type) 
    }
    const decoding: DecodingObject = { data: info, type: TypeProbe }
    const decodings: DecodingObjects = [decoding]
    const id = `temporary-${crypto.randomUUID()}`
    const shared: MediaObject = { file, type, label, request, decodings, id }

    switch (type) {
      case TypeAudio: {
        return requestAudioPromise(request).then(loadedAudio => {
          const { duration } = loadedAudio
          info.duration = duration
          const object: AudioMediaObject = { ...shared, loadedAudio }
          return object
        })
      }
      case TypeImage: {
        return requestImagePromise(request).then(image => {
          const { width, height } = image
          info.width = width
          info.height = height
          const object: ImageMediaObject = { ...shared, loadedImage: image }
          return object
        })
      }
      case TypeVideo: {
        return requestVideoPromise(request).then(video => {
          const { duration, videoWidth, clientWidth, videoHeight, clientHeight } = video
          const width = videoWidth || clientWidth
          const height = videoHeight || clientHeight
          info.duration = duration
          info.width = width
          info.height = height
          const object: VideoMediaObject = { ...shared, loadedVideo: video }
          return object
        })
      }
      case TypeFont: {
        return requestFontPromise(request).then(font => {
          const object: FontMediaObject = { ...shared, loadedFont: font }
          return object
        })
      }
    }
  }
  
  @property({ type: String, attribute: 'font-extensions' })
  fontExtensions = ''

  @property({ type: Number, attribute: 'font-max' })
  fontMax = -1


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
    const media: MediaObjects = []
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
      this.importedMediaObjects = [...this.importedMediaObjects, ...mediaObjects]
    })
    event.stopPropagation()
  }

  @property({ type: Array, attribute: false })
  importedMediaObjects: MediaObjects = []

  protected masher?: Masher | undefined
  private _masherPromise?: Promise<void>
  private get masherPromise() {
    return this._masherPromise ||= this.masherPromiseInitialize
  }
  private get masherPromiseInitialize(): Promise<void> {
    return this.corePromise.then(() => {
      const masher = this.core!.masherInstance()
      this.masher = masher
      TypesImport.forEach(type => {
        masher.eventTarget.addEventListener(`client${type}`, this.clientMediaHandler.bind(this))
      })
    })
  }

  protected mediaHandler(event: MediaEvent) {
    const { detail } = event
    const { mediaObject } = detail
    // console.log(this.constructor.name, 'mediaHandler', mediaObject.label)
    detail.promise = this.masherPromise.then(() => {
      return this.masher!.media.fromObject(mediaObject)
    })
    event.stopPropagation()
  }

  @property({ type: Array, attribute: false })
  mediaObjectsFetched: MediaObjects = []

  private _mediaObjects?: MediaObjects 
  @property({ type: Array, attribute: false })
  get mediaObjects() {
    return this._mediaObjects ||= this.mediaObjectsInitialize
  }
  private get mediaObjectsInitialize() {
    const { mediaType } = this
    // TODO: use exclude* properties...

    const combined = [...this.importedMediaObjects, ...this.mediaObjectsFetched]
    const filtered = combined.filter(mediaObject => {
      const { type } = mediaObject
      return mediaType === type
    })

    return filtered
  }

  private mediaObjectsRefresh() {
    // console.log(this.constructor.name, 'mediaObjectsRefresh', this.movieMasherContext)
    delete this._mediaObjects
    this.updateContext({ mediaObjects: this.mediaObjects })
  }

  mediaObjectsParams: MediaObjectsParams = { type: TypeImage }

  @property({ type: String }) 
  mediaSource = ''

  protected mediaObjectHandler(event: MediaObjectEvent) {
    const { detail } = event
    const { id } = detail
    detail.mediaObject = this.movieMasherContext.mediaObjects.find(media => media.id === id)
    event.stopPropagation()
  }

  private _mediaObjectsFetchedPromise?: Promise<MediaObjects>
  private get mediaObjectsFetchedPromise(): Promise<MediaObjects> {
    return this._mediaObjectsFetchedPromise ||= this.mediaObjectsFetchedPromiseInitialize
  }
  private get mediaObjectsFetchedPromiseInitialize(): Promise<MediaObjects> {
    const { mediaSource } = this
    const url = mediaSource || (new URL('../json/media.json', import.meta.url)).href
    // console.log(this.tagName, 'mediaObjectsFetchedPromiseInitialize', url)
    return fetch(url).then(res => res.json())
  }
  private mediaObjectsFetchedRefresh() {
    // console.log(this.constructor.name, 'mediaObjectsFetchedRefresh', this.movieMasherContext)

    delete this._mediaObjectsFetchedPromise

    const { mediaObjectsParams: params } = this
    const detail: MediaObjectsEventDetail = { ...params, type: this.mediaType }
    const init: CustomEventInit<MediaObjectsEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    this.dispatchEvent(new CustomEvent('mediaobjects', init))

    const { promise } = detail
    const mediaObjectsPromise = promise || this.mediaObjectsFetchedPromise
    mediaObjectsPromise.then(mediaObjectsFetched => {
      // console.log(this.constructor.name, 'mediaObjectsFetchedRefresh setting mediaObjectsFetched', mediaObjectsFetched)
      this.mediaObjectsFetched = mediaObjectsFetched
    })  
  }

  @property({ type: String, attribute: 'media-type' })
  mediaType: MediaType = TypeImage

  private mediaTypeHandler(event: MediaTypeEvent) {
    const { detail: mediaType } = event
    console.log(this.constructor.name, 'mediaTypeHandler', mediaType)
    this.mediaType = mediaType
    this.updateContext({ mediaType })
  }

  @provide({ context: movieMasherContext })
  @property({ type: Object, attribute: false })
  movieMasherContext: MovieMasher = { 
    accept: this.accept,
    mediaType: this.mediaType, 
    mediaObjects: this.mediaObjects,
  }

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

  private updateContext(options: Partial<MovieMasher>) {
    const { movieMasherContext } = this
    if (!movieMasherContext) return 

    this.movieMasherContext = { ...movieMasherContext, ...options }
  }

  @property({ type: String, attribute: 'video-extensions' })
  videoExtensions = ''
  
  @property({ type: Number, attribute: 'video-max' })
  videoMax = -1

  protected override willUpdate(values: PropertyValues<this>): void {
    if (values.has('mediaType')) {
      console.log('willUpdate mediaType', this.mediaType)
      this.mediaObjectsFetchedRefresh()
    }
    if (values.has('mediaObjectsFetched') || values.has('importedMediaObjects')) {
      // console.log('willUpdate mediaObjects dependency', this.mediaObjectsFetched.length, this.importedMediaObjects.length)
      this.mediaObjectsRefresh()
    }
    const changedAccept = TypesImport.some(mediaType => (
      SuffixesInput.some(suffix => values.has(`${mediaType}${suffix}`))
    ))
    if (changedAccept) {      
      // console.log('willUpdate accept dependency')
      this.acceptRefresh()
    }
  }

  static styleBox = css`
    * {
      box-sizing: border-box;
    }
  `
  
  static cssVariables = css`
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
  `
  static styleIdk = css`
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
  static styleForm = css`
    div {
      flex-grow: 1;
      display: grid;
      gap: var(--gap);
      grid-template-areas: var(--areas);
      grid-template-columns: var(--columns);
      grid-template-rows: var(--rows);
    }
  `

  static styleQueries = css`
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
  `
  static override styles = [
    Component.cssHostFlex,
    MovieMasherElement.cssVariables,
    MovieMasherElement.styleBox,
    MovieMasherElement.styleForm,
    MovieMasherElement.styleQueries,
    MovieMasherElement.styleIdk,
  ]
}
