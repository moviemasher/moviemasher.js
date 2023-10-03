import type { Masher } from '@moviemasher/runtime-client'
import type { AssetObject, AssetObjects } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from './declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { EventAssetObject, EventAssetObjects, EventIcon, EventManagedAssets, MovieMasher } from '@moviemasher/runtime-client'
import { ERROR, error, isDefined, isDefiniteError } from '@moviemasher/runtime-shared'
import { html } from 'lit-html/lit-html.js'
import { Component } from './Base/Component.js'
import { Slotted } from './Base/Slotted.js'
import { DOT } from '@moviemasher/lib-shared'

const FormSlotViewer = 'viewer'
const FormSlotSelector = 'browser'
const FormSlotComposer = 'timeline'
const FormSlotInspector = 'inspector'
const FormSlotDialog = 'dialog'

/**
 * @tag movie-masher
 */
export class MovieMasherElement extends Slotted {
  constructor() {
    super()
    this.listeners[EventAssetObject.Type] = this.handleAssetObject.bind(this)
    this.listeners[EventAssetObjects.Type] = this.handleAssetObjects.bind(this)
    this.listeners[EventIcon.Type] = this.handleIcon.bind(this)
    this.listeners[EventManagedAssets.Type] = this.handleManagedAssets.bind(this)

    // TODO: load these lazily
    this.imports = [
      'media/client-audio.js',
      'media/client-font.js',
      'media/client-image.js',
      'media/client-video.js',


      'asset/element.js',
      'clip/element.js',

      'asset/save.js',
      'asset/upload.js',
      'asset/encode.js',
      'asset/decode.js',
      'asset/transcode.js',

      'control/asset.js',
      'control/boolean.js',
      'control/numeric.js',
      'control/rgb.js',
      'control/string.js',

      'control/group/aspect.js',
      'control/group/dimensions.js',
      'control/group/fill.js',
      'control/group/location.js',
      'control/group/time.js',
    ].map(suffix => `./${suffix}`).join(',')
  }
  private _mashingAssetObject?: AssetObject 
  private get mashingAssetObject() { return this._mashingAssetObject }
  private set mashingAssetObject(object: AssetObject | undefined) {
    // console.log(this.tagName, 'SET assetObject', assetObject)
    const { _mashingAssetObject: original } = this
    if (original === object) return

    this._mashingAssetObject = object
    if (object) {
      this.masherPromise.then(() => {
        // console.log(this.tagName, 'SET assetObject masherPromise', assetObject)

        this.masher!.load(object).then(() => {
          // console.log(this.tagName, 'masher DID load')
        })
      })
    } else this.masher?.unload()
  }

  assetObject?: string

  private _assetObjectPromise?: Promise<void>

  private get assetObjectPromise() {
    // console.debug(this.tagName, 'assetObjectPromise...')
    return this._assetObjectPromise ||= this.assetObjectPromiseInitialize
  }

  private get assetObjectPromiseInitialize(): Promise<void> {
    return import(this.url('asset/object/video')).then(() => {
      const { assetObject } = this
      if (assetObject) {
        MovieMasher.options.assetObjectOptions ||= { request: { endpoint: assetObject }}
      } 
      // console.debug(this.tagName, 'assetObjectPromise!')
      const listener = { [EventAssetObject.Type]: this.listeners[EventAssetObject.Type] }
      MovieMasher.eventDispatcher.listenersRemove(listener)
    })
  }

  assetObjects?: string

  protected assetObjectsImported: AssetObjects = []

  private _assetObjectsPromise?: Promise<void>

  private get assetObjectsPromise() {
    // console.debug(this.tagName, 'assetObjectsPromise...')
    return this._assetObjectsPromise ||= this.assetObjectsPromiseInitialize
  }

  private get assetObjectsPromiseInitialize(): Promise<void> {
    return import(this.url('asset/objects/fetch')).then(() => {
      const { assetObjects } = this
      if (assetObjects) {
        MovieMasher.options.assetObjectsOptions ||= { request: { endpoint: assetObjects }}
      }
      // console.debug(this.tagName, 'assetObjectsPromise!')
      const listener = { [EventAssetObjects.Type]: this.listeners[EventAssetObjects.Type] }
      MovieMasher.eventDispatcher.listenersRemove(listener)
    })
  }

  override connectedCallback(): void {
    super.connectedCallback()
    MovieMasher.importPromise.then(() => {
      const { imports } = this
      if (imports) {
        const libs = imports.split(',').map(lib => lib.trim()).filter(Boolean)
        if (libs.length) {
          const hrefs = libs.map(lib => (
            lib.startsWith(DOT) ? (new URL(lib, import.meta.url)).href : lib
          ))
          const first = hrefs.shift()
          let promise = import(first!)
          hrefs.forEach(href => { promise = promise.then(() => import(href)) })
          promise.then(() => {
            if (this.mashingAssetObject) return  
            
            const event = new EventAssetObject()
            MovieMasher.eventDispatcher.dispatch(event)
            const { promise } = event.detail
            if (!promise) return

            return promise.then(orError => {
              if (!isDefiniteError(orError)) {
                const { data: assetObject } = orError
                this.mashingAssetObject = assetObject
              }
            })
          })
        }
      }    
    })
  }
  
  private handleAssetObject(event: EventAssetObject) {
    const { assetObject } = this
    if (!assetObject && isDefined(assetObject)) return
    
    const { detail } = event
    detail.promise = this.assetObjectPromise.then(() => {
      MovieMasher.eventDispatcher.dispatch(event)
      return detail.promise!
    })
  }

  private handleAssetObjects(event: EventAssetObjects) {
    const { assetObjects } = this
    if (!assetObjects && isDefined(assetObjects)) return

    const { detail } = event
    detail.promise = this.assetObjectsPromise.then(() => {
      MovieMasher.eventDispatcher.dispatch(event)
      return detail.promise!
    })
  }

  private handleIcon(event: EventIcon) {
    const { icons } = this
    if (!icons && isDefined(icons)) return
    
    const { detail } = event
    detail.promise = this.iconPromise.then(() => {
      delete detail.promise
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = detail
      if (promise) return promise  
      
      return error(ERROR.Unknown)
    })
  }

  private handleManagedAssets(event: EventManagedAssets) {
    const { detail } = event
    detail.promise = this.managedAssetsPromise.then(() => {
      MovieMasher.eventDispatcher.dispatch(event)
      return detail.promise!
    })
  }

  private _iconPromise?: Promise<void>

  private get iconPromise() {
    const { _iconPromise, icons } = this
    if (_iconPromise) return _iconPromise
    
    const iconHandler = icons ? 'icon/fetch' : 'icon/local'
    return this._iconPromise = import(this.url(iconHandler)).then(() => {
      if (icons) {
        MovieMasher.options.iconOptions ||= { request: { endpoint: icons }}
      }
      const listener = { [EventIcon.Type]: this.listeners[EventIcon.Type] }
      MovieMasher.eventDispatcher.listenersRemove(listener)
    })
  }

  icons?: string

  imports?: string | undefined

  private _managedAssetsPromise?: Promise<void>

  private get managedAssetsPromise() {
    // console.debug(this.tagName, 'managedAssetsPromise')
    return this._managedAssetsPromise ||= import(this.url('utility/ClientAssetManagerClass')).then(() => {
      const listener = { [EventManagedAssets.Type]: this.listeners[EventManagedAssets.Type] }
      MovieMasher.eventDispatcher.listenersRemove(listener)
    })
  }
  protected masher?: Masher | undefined
  private _masherPromise?: Promise<void>
  private get masherPromise() {
    return this._masherPromise ||= this.masherPromiseInitialize
  }
  private get masherPromiseInitialize(): Promise<void> {
    // console.debug(this.tagName, 'masherPromiseInitialize')
    return import('./asset/mash/MasherFactory.js').then(lib => {
      const { masherInstance } = lib
      this.masher = masherInstance()
    })
  }

  protected override partContent(part: string, slots: Htmls): OptionalContent {
    switch(part) {
      case FormSlotDialog: {
        this.importTags(`movie-masher-component-dialog`)
        break
      }
      case FormSlotViewer:
      case FormSlotSelector:
      case FormSlotComposer:
      case FormSlotInspector: {
        this.importTags(`movie-masher-${part}-section`)
        break
      }
    }
    switch(part) {
      case FormSlotDialog: return html`
        <movie-masher-component-dialog 
          @export-parts='${this.handleExportParts}'
          part='${part}'
        >${slots}</movie-masher-component-dialog>
      `
      case FormSlotViewer: return html`
        <movie-masher-viewer-section 
          @export-parts='${this.handleExportParts}'
          part='${part}'
        >${slots}</movie-masher-viewer-section>
      `
      case FormSlotSelector: return html`
        <movie-masher-browser-section
          @export-parts='${this.handleExportParts}'
          part='${part}'
          icon='browser'
        >${slots}</movie-masher-browser-section>
      `
      case FormSlotComposer: return html`
        <movie-masher-timeline-section
          @export-parts='${this.handleExportParts}'
          part='${part}'
          icon='timeline'
        >${slots}</movie-masher-timeline-section>
      `
      case FormSlotInspector: return html`
        <movie-masher-inspector-section
          @export-parts='${this.handleExportParts}'
          part='${part}'
          icon='inspector'
        >${slots}</movie-masher-inspector-section>
      `
    }
    return super.partContent(part, slots)
  }

  override parts = [
    FormSlotViewer, 
    FormSlotSelector,  
    FormSlotComposer, 
    FormSlotInspector, 
    FormSlotDialog,
  ].join(Slotted.partSeparator)

  private url(path: string): string {
    return new URL(`${path}.js`, import.meta.url).href
  }

  static override properties: PropertyDeclarations = {
    ...Slotted.properties,
    imports: { type: String },
    assetObjects: { type: String, attribute: 'asset-objects' },
    assetObject: { type: String, attribute: 'asset-object' },
    icons: { type: String },
  }

  static cssVariablesLayout = css`
    :host {
      --max-dimension: 480px;
      --ratio-preview: 0.25;
      --progress-width: 64px;
      --control-size: 24px;
      --control-padding: 10px;
      --control-spacing: 5px;

      --label-size: var(--control-size);

      --content-padding: 10px;
      --content-spacing: 10px;


      --viewer-width: 270px;
      --viewer-height: 480px;
      --scrubber-height: 16px;
      --scrubber-width: 16px;
      --inspector-width: 240px;
      --track-width: 34px;
      --track-height: 60px;
      --footer-height: 38px;
      --gap: 20px;
      --header-height: 38px;
      --flex-direction: row;
      --dialog-height: 50vh;
      --dialog-width: 50vw;
      --padding: 40px;
      --spacing: 20px;
      --icon-size: 24px;
      
      --inspector-spacing: 5px;
      --inspector-padding: 10px;
    }
  `

  static cssVariables = css`
    :host {
    
      --border-radius: 5px;
      --border-size: 1px;
      --border: var(--border-size) solid;
      --button-size: 24px;

      --color-transition: 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)-out;

      --hue: 281;
      
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

      
      
      --drop-size: 2px;
      
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
        
      --control-back: oklch(var(--lightness-back-secondary) 0 0);
      --control-back-disabled: var(--control-back);
      --control-back-hover: var(--control-back);
      --control-back-selected: var(--control-back);

      --control-hover-selected: oklch(var(--lightness-fore-primary) var(--chroma-primary) var(--hue));
      --control-fore-disabled: oklch(var(--lightness-fore-secondary) 0 0);

      --control-fore-hover: var(--control-hover-selected);
      --control-fore-selected:var(--control-hover-selected);
      --control-fore: var(--fore-secondary);
      --control-padding: 5px;
      --control-spacing: 5px;

      --item-fore: var(--control-fore);
      --item-fore-selected: var(--control-fore-selected);
      --item-fore-hover: var(--control-fore-hover);
      --item-back: var(--control-back);
      --item-back-hover-selected: oklch(var(--lightness-back-primary) var(--chroma-primary) var(--hue));

      --item-back-selected: var(--item-back-hover-selected);
      --item-back-hover:  var(--item-back-hover-selected);

      --color-drop: red;
    }
  `

  static cssDarkMediaQuery = css`
    @media(prefers-color-scheme: dark) {
      :host {
        --lightness-back-primary: var(--darkness-back-primary);
        --lightness-back-secondary: var(--darkness-back-secondary);
        --lightness-back-tertiary: var(--darkness-back-tertiary);
        --lightness-fore-primary: var(--darkness-fore-primary);
        --lightness-fore-secondary: var(--darkness-fore-secondary);
        --lightness-fore-tertiary: var(--darkness-fore-tertiary);
      } 
    }
  `

  static cssGrid = css`
    :host {
      --areas:
        "preview browser browser"
        "timeline timeline inspect"
      ;
      --columns:
        min-content
        1fr
      ;
      --rows:
        min-content
        1fr
      ;

      flex-grow: 1;
      display: grid;
      gap: var(--gap);
      grid-template-areas: var(--areas);
      grid-template-columns: var(--columns);
      grid-template-rows: var(--rows);
    } 
  `

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    MovieMasherElement.cssVariables,
    MovieMasherElement.cssVariablesLayout,
    MovieMasherElement.cssDarkMediaQuery,
    MovieMasherElement.cssGrid,
  ]
}

// register web component as custom element
customElements.define('movie-masher', MovieMasherElement)
