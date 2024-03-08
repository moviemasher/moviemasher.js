import type { Masher } from './types.js'
import type { AssetObject, AssetObjects } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from './client-types.js'

import './runtime.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { EventAssetObject, EventAssetObjects, EventEdited, EventChangedMashAsset, EventManagedAssets } from './module/event.js'
import { COMMA, $GET, $MASH, MOVIE_MASHER, PIPE, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { html } from 'lit-html'
import { Component } from './base/component.js'
import { ComponentSlotter } from './base/component.js'
import { isChangeEdit, isMashAsset } from '@moviemasher/shared-lib/utility/guards.js'
import { patchSvg, svgImagePromise } from '@moviemasher/shared-lib/utility/svg.js'

const FormSlotPlayer = 'player'
const FormSlotBrowser = 'browser'
const FormSlotTimeline = 'timeline'
const FormSlotInspector = 'inspector'
const FormSlotDialog = 'dialog'

export const MovieMasherTag = 'movie-masher'


// test for support for load events from svg images
const initializeSvg = () => {
  const { window, options } = MOVIE_MASHER
  const { document } = window
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const context = canvas.getContext('2d')
  if (context) {
    context.fillRect(0, 0, 1, 1)
    svgImagePromise(canvas.toDataURL(), true).then(() => {
      options.supportsSvgLoad = true
    })
  }
}

/**
 * @category Elements
 */
export class MovieMasherElement extends ComponentSlotter {
  constructor() {
    super()
    // console.debug(this.tagName, 'constructor listening for', EventAssetObjects.Type)
    this.listeners[EventAssetObject.Type] = this.handleAssetObject.bind(this)
    this.listeners[EventAssetObjects.Type] = this.handleAssetObjects.bind(this)
    this.listeners[EventManagedAssets.Type] = this.handleManagedAssets.bind(this)
    
    this.listeners[EventEdited.Type] = this.handleEdited.bind(this)
    this.listeners[EventChangedMashAsset.Type] = this.handleChangedMashAsset.bind(this)
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
    return import(this.url('handler/object/video')).then(() => {
      const { assetObject } = this
      if (assetObject) {
        MOVIE_MASHER.options.assetObject ||= { endpoint: assetObject, init: { method: $GET } }
      } 
      // console.debug(this.tagName, 'assetObjectPromise!')
      const listener = { [EventAssetObject.Type]: this.listeners[EventAssetObject.Type] }
      MOVIE_MASHER.listenersRemove(listener)
    })
  }

  /**
   * @attr asset-objects - URL for asset objects endpoint
   */
  assetObjects?: string

  protected assetObjectsImported: AssetObjects = []

  private _assetObjectsPromise?: Promise<void>

  private get assetObjectsPromise() {
    // console.debug(this.tagName, 'assetObjectsPromise')
    return this._assetObjectsPromise ||= this.assetObjectsPromiseInitialize
  }

  private get assetObjectsPromiseInitialize(): Promise<void> {
    // console.debug(this.tagName, 'assetObjectsPromiseInitialize')
    return import(this.url('handler/objects/fetch')).then(() => {
      const { assetObjects } = this
      // console.debug(this.tagName, 'assetObjectsPromiseInitialize', assetObjects)
      if (assetObjects) {
        MOVIE_MASHER.options.assetObjects ||= { endpoint: assetObjects, init: { method: $GET } }
      }
      // console.debug(this.tagName, 'assetObjectsPromise removing listener')
      const listener = { [EventAssetObjects.Type]: this.listeners[EventAssetObjects.Type] }
      MOVIE_MASHER.listenersRemove(listener)
    })
  }

  override connectedCallback(): void {
    super.connectedCallback()
    patchSvg(this.selectElement(this.svgPatch))
    initializeSvg()
    const { icons, imports } = this
    if (icons) {
      MOVIE_MASHER.options.icons ||= { endpoint: icons, init: { method: $GET } }
    }
    if (imports) {
      const importeds = imports.split(COMMA)
      importeds.forEach(imported => {
        const [key, value] = imported.split(PIPE)
        MOVIE_MASHER.imports[key] = value
      })
    }

    MOVIE_MASHER.importPromise().then(importResultOrError => {
      if (isDefiniteError(importResultOrError)) return
      if (this.mashingAssetObject) return  
      
      const event = new EventAssetObject()
      MOVIE_MASHER.dispatchCustom(event)
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
    
  private handleAssetObject(event: EventAssetObject) {
    if (this.assetObject === '') return
    
    const { detail } = event
    detail.promise = this.assetObjectPromise.then(() => {
      MOVIE_MASHER.dispatchCustom(event)
      return detail.promise!
    })
  }

  private handleAssetObjects(event: EventAssetObjects) {
    if (this.assetObjects === '') return

    const { detail } = event
    detail.promise = this.assetObjectsPromise.then(() => {
      MOVIE_MASHER.dispatchCustom(event)
      return detail.promise!
    })
  }


  private handleChangedMashAsset(event: EventChangedMashAsset): void {
    // console.log(this.tagName, 'handleChangedMashAsset', !!event.detail)
    const { detail: target } = event
    if (target) this.variableSet('mash-color', target.value('color'))
  }

  private handleEdited(event: EventEdited): void {
    const { detail: action } = event
    if (!isChangeEdit(action)) return

    const { target, affects } = action
    if (isMashAsset(target)) {
      if (affects.includes(`${$MASH}.color`)) {
        this.variableSet('mash-color', target.value('color'))
      }
    } 
  }


  private handleManagedAssets(event: EventManagedAssets) {
    const { detail } = event
    detail.promise = this.managedAssetsPromise.then(() => {
      MOVIE_MASHER.dispatchCustom(event)
      return detail.promise!
    })
  }

  icons = 'json/icons.json'

  imports = ''

  private _managedAssetsPromise?: Promise<void>

  private get managedAssetsPromise() {
    return this._managedAssetsPromise ||= import(this.url('handler/manager')).then(() => {
      const listener = { [EventManagedAssets.Type]: this.listeners[EventManagedAssets.Type] }
      MOVIE_MASHER.listenersRemove(listener)
    })
  }
  protected masher?: Masher | undefined
  private _masherPromise?: Promise<void>
  private get masherPromise() {
    return this._masherPromise ||= this.masherPromiseInitialize
  }
  private get masherPromiseInitialize(): Promise<void> {
    return import('./utility/masher.js').then(lib => {
      const { masherInstance } = lib
      this.masher = masherInstance()
    })
  }

  protected override partContent(part: string, slots: Htmls): OptionalContent {
    this.loadComponent(`movie-masher-${part}`)
    switch(part) {
      case FormSlotDialog: return html`
        <movie-masher-dialog 
          @export-parts='${this.handleExportParts}'
          part='${part}'
        >${slots}</movie-masher-dialog>
      `
      case FormSlotPlayer: return html`
        <movie-masher-player 
          @export-parts='${this.handleExportParts}'
          part='${part}'
        >${slots}</movie-masher-player>
      `
      case FormSlotBrowser: return html`
        <movie-masher-browser
          @export-parts='${this.handleExportParts}'
          part='${part}'
        >${slots}</movie-masher-browser>
      `
      case FormSlotTimeline: return html`
        <movie-masher-timeline
          @export-parts='${this.handleExportParts}'
          part='${part}'
          icon='timeline'
        >${slots}</movie-masher-timeline>
      `
      case FormSlotInspector: return html`
        <movie-masher-inspector
          @export-parts='${this.handleExportParts}'
          part='${part}'
        >${slots}</movie-masher-inspector>
      `
    }
    return super.partContent(part, slots)
  }

  override parts = [
    FormSlotPlayer, 
    FormSlotBrowser,  
    FormSlotTimeline, 
    FormSlotInspector, 
    FormSlotDialog,
  ].join(ComponentSlotter.partSeparator)

  svgPatch = ''

  private url(path: string): string {
    return new URL(`${path}.js`, import.meta.url).href
  }

  static override properties: PropertyDeclarations = {
    ...ComponentSlotter.properties,
    assetObjects: { type: String, attribute: 'asset-objects' },
    assetObject: { type: String, attribute: 'asset-object' },
    icons: { type: String },
    imports: { type: String },
    svgPatch: { type: String, attribute: 'svg-patch' },
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        --back-chrome: oklch(var(--lightness-5) 0 0);
        --back-content: oklch(var(--lightness-6) 0 0);
        --border: var(--size-border) solid;
        --chroma: 0.085;
        --color-drop: oklch(var(--lightness-4) 0.25768330773615683 29.2338851923426);
        --color-transition: 1.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)-out;
        --darkness-1: 95%;
        --darkness-2: 75%;
        --darkness-3: 65%;
        --darkness-4: 45%;
        --darkness-5: 35%;
        --darkness-6: 25%;
        --fore-chrome: oklch(var(--lightness-1) 0 0);
        --fore-content: oklch(var(--lightness-2) 0 0);
        --gap-chrome: 5px;
        --gap-content: 10px;
        --gap-control: 5px;
        --gap: 20px;
        --height-control: 24px;
        --height-dialog: 50vh;
        --height-footer: 38px;
        --height-header: 38px;
        --height-label: 24px;
        --height-scrubber: 16px;
        --height-track: 60px;
        --hue: 281;
        --lightness-1: 25%;
        --lightness-2: 35%;
        --lightness-3: 45%;
        --lightness-4: 65%;
        --lightness-5: 75%;
        --lightness-6: 95%;
        --off-chrome: oklch(var(--lightness-2) 0 0);
        --off-content: oklch(var(--lightness-3) 0 0);
        --on-chrome: oklch(var(--lightness-2) var(--chroma) var(--hue));
        --on-content: oklch(var(--lightness-3) var(--chroma) var(--hue));
        --over-chrome: oklch(var(--lightness-3) var(--chroma) var(--hue));
        --over-content: oklch(var(--lightness-4) var(--chroma) var(--hue));
        --pad-chrome: 5px;
        --pad-content: 10px;
        --pad-control: 4px;
        --pad-label: 5px;
        --pad: var(--gap);
        --radius-border: 5px;
        --ratio-preview: 0.25;
        --size-border: 1px;
        --size-drop: 2px;
        --size-preview: 480px;
        --spacing: 20px;
        --width-dialog: 66vw;
        --width-inspector: 240px;
        --width-scrubber: 16px;
        --width-track: 34px;
        --mash-color: black;
        --dropping-shadow: 
          var(--size-drop) var(--size-drop) 0 0 var(--color-drop) inset,
          calc(-1 * var(--size-drop)) calc(-1 * var(--size-drop)) 0 0 var(--color-drop) inset;
        ;

        --areas:
          "player browser browser"
          "timeline timeline inspector"
        ;
        --columns: min-content 1fr;
        --rows: min-content 1fr;

        display: grid;
        flex-grow: 1;
        gap: var(--gap);
        grid-template-areas: var(--areas);
        grid-template-columns: var(--columns);
        grid-template-rows: var(--rows);
        padding: var(--pad);
        line-height: normal;
      } 

      @media(prefers-color-scheme: dark) {
        :host {
          --lightness-6: var(--darkness-6);
          --lightness-5: var(--darkness-5);
          --lightness-4: var(--darkness-4);
          --lightness-3: var(--darkness-3);
          --lightness-2: var(--darkness-2);
          --lightness-1: var(--darkness-1);
        } 
      }
    `
  ]
}

customElements.define(MovieMasherTag, MovieMasherElement)

declare global {
  interface HTMLElementTagNameMap {
    [MovieMasherTag]: MovieMasherElement
  }
}
