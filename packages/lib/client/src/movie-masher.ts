import type { 
  AssetObject, Rect,
} from '@moviemasher/runtime-shared'

import type { 
  Masher, MasherOptions, RectEvent,
} from '@moviemasher/runtime-client'

import type { CSSResultGroup } from 'lit'

import type {
  CoreLib,
  Htmls,
  OptionalContent,
  AssetObjectPromiseEventDetail,
  Contents,
  Content,
} from './declarations.js'

import { 
  SourceRaw,
  SourceText,
  DotChar,
  isDefiniteError
} from '@moviemasher/runtime-shared'
import { MovieMasher, EventTypeAssetObject, EventTypeViewerContentResize } from '@moviemasher/runtime-client'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'

import { Component } from './Base/Component.js'
import { Slotted } from './Base/Slotted.js'
// import './icon/fetch.js'

const FormSlotViewer = 'viewer'
const FormSlotSelector = 'selector'
const FormSlotComposer = 'composer'
const FormSlotImporter = 'importer'

/**
 * @prop (String) icon - id of icon to use for viewer section
 * @cssprop --hue - component of oklch base color
 * 
 * @tag movie-masher
 */
export class MovieMasherElement extends Slotted {
  constructor() {
    super()
    this.imports = [
      'icon/fetch.js',
      'asset/color/image.js',
      'asset/shape/image.js',
      'asset/objects/fetch.js',
      'asset/object/video.js',
      ...[SourceRaw, SourceText].map(source => `asset/${source}/importer.js`),
    ].map(suffix => `./${suffix}`).join(',')

    this.listeners[EventTypeViewerContentResize] = this.handleResize.bind(this)
  }
  private _assetObject?: AssetObject 
  private get assetObject() { return this._assetObject }
  private set assetObject(assetObject: AssetObject | undefined) {
    console.log(this.tagName, 'SET assetObject', assetObject)
    const { _assetObject: original } = this
    if (original === assetObject) return
    this._assetObject = assetObject

    if (assetObject) {
      this.masherPromise.then(() => {
        console.log(this.tagName, 'SET assetObject masherPromise', assetObject)

        this.masher!.load(assetObject).then(() => {
          console.log(this.tagName, 'masher DID load')
        })
      })
    } else this.masher?.unload()
  }

  override connectedCallback(): void {
    super.connectedCallback()
    const { imports } = this
    if (imports) {
      const libs = imports.split(',').map(lib => lib.trim()).filter(Boolean)
      if (libs.length) {
        const hrefs = libs.map(lib => (
          lib.startsWith(DotChar) ? (new URL(lib, import.meta.url)).href : lib
        ))

        const first = hrefs.shift()
        let promise = import(first!)
        hrefs.forEach(href => {
          promise = promise.then(() => import(href))

        })
        promise.then(() => {
          if (this.assetObject) return  
          
          const detail: AssetObjectPromiseEventDetail = {}
          const event = new CustomEvent(EventTypeAssetObject, { detail })
          MovieMasher.eventDispatcher.dispatch(event)
          const { promise } = detail
          if (!promise) {
            console.log(this.tagName, 'NO promise')
            return 
          }
          return promise.then(orError => {

            if (!isDefiniteError(orError)) {
              const { data: assetObject } = orError
              console.log(this.tagName, 'YES promise', assetObject, orError)
              this.assetObject = assetObject
            }
          })
        
        })
      }
    }
  }
  
  override disconnectedCallback(): void {
    super.disconnectedCallback()
  }
    
  protected override content(contents: Contents): Content {
    return html`${contents}`
  }

  private rect?: Rect
  private handleResize(event: RectEvent) {
    this.rect = event.detail 
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
    if (name === FormSlotImporter) {
      this.importTags('movie-masher-component-dialog')
      return html`<movie-masher-component-dialog 
        @slotted='${this.slottedHandler}'
        slotted='${FormSlotImporter}' section='${FormSlotImporter}'
      ></movie-masher-component-dialog>`
    }
    
    this.importTags(`movie-masher-${name}-section`)
    
    switch(name) {
      case FormSlotViewer: {
        return html`<movie-masher-viewer-section 
          @slotted='${this.slottedHandler}'
          part='${name}' slotted='${name}'
          icon='${this.icon}'
        >${htmls}</movie-masher-viewer-section>`
      }
      case FormSlotSelector: {
        return html`<movie-masher-selector-section
          @slotted='${this.slottedHandler}'
          part='${name}' slotted='${name}'
          icon='browser'
        >${htmls}</movie-masher-selector-section>`
      }
      case FormSlotComposer: {
        return html`<movie-masher-composer-section
          @slotted='${this.slottedHandler}'
          part='${name}' slotted='${name}'
          icon='timeline'
        >${htmls}</movie-masher-composer-section>`
      }
    }
  }


  icon = 'app'

  imports?: string | undefined

  protected masher?: Masher | undefined
  private _masherPromise?: Promise<void>
  private get masherPromise() {
    return this._masherPromise ||= this.masherPromiseInitialize
  }
  private get masherPromiseInitialize(): Promise<void> {
    return this.sharedPromise.then(() => {
      const options: MasherOptions = {
        mash: this.assetObject, 
        dimensions: this.rect,
      }
      const masher = this.core!.masherInstance(options)
      MovieMasher.masher = this.masher = masher
      console.log(this.tagName, 'masherPromiseInitialize SET masher')
    })
  }

  readonly = false

  override slots = [
    FormSlotViewer, 
    FormSlotSelector,  
    FormSlotComposer, 
    FormSlotImporter,
  ]

  static override properties = {
    ...Slotted.properties,
    imports: { type: String },
    icon: { type: String },
  }
  static override styles: CSSResultGroup = [
    Component.cssHostFlex,
    css`
      :host {
        --dialog-width: 50vw;
        --dialog-height: 50vh;
        --icon-size: 24px;
        --button-size: 24px;
        --flex-direction: row;

        
        --padding: 40px;
        --spacing: 20px;
        --header-height: 38px;
        --footer-height: 38px;
        --content-padding: 10px;
        --content-spacing: 10px;

        --border-size: 1px;
        --border: var(--border-size) solid;
        --border-radius: 5px;

        --hue: 281;
        --gap: 20px;
        --areas:
          "preview media"
          "compose compose";
        --columns:
          calc(
            var(--viewer-width)
            + (var(--border-size) * 2)
          )
          1fr;
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
        --control-fore-disabled: oklch(var(--lightness-fore-secondary) 0 0);

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

      }
    
      * {
        box-sizing: border-box;
      }
    
      :host {
        flex-grow: 1;
        display: grid;
        gap: var(--gap);
        grid-template-areas: var(--areas);
        grid-template-columns: var(--columns);
        grid-template-rows: var(--rows);
      }
 
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

// register web component as custom element
customElements.define('movie-masher', MovieMasherElement)
