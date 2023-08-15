import type { PropertyDeclarations } from 'lit'
import type { AssetObject } from '@moviemasher/runtime-shared'
import type { Masher } from '@moviemasher/runtime-client'
import type { CSSResultGroup } from 'lit'
import type { AssetObjectPromiseEventDetail, Htmls, OptionalContent } from './declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { DotChar, SourceRaw, SourceText, isDefiniteError } from '@moviemasher/runtime-shared'
import { EventTypeAssetObject, MovieMasher } from '@moviemasher/runtime-client'
import { Slotted } from './Base/Slotted.js'
import { Component } from './Base/Component.js'

const FormSlotViewer = 'viewer'
const FormSlotSelector = 'selector'
const FormSlotComposer = 'composer'
const FormSlotInspector = 'inspector'
const FormSlotDialog = 'dialog'

/**
 * @tag movie-masher
 */
export class MovieMasherElement extends Slotted {
  constructor() {
    super()

    this.imports = [
      'media/client-audio.js',
      'media/client-font.js',
      'media/client-image.js',
      'media/client-video.js',
      'asset/color/image.js',
      'asset/mash/video.js',
      'asset/element.js',
      'asset/save.js',
      'asset/object/video.js',
      'asset/objects/fetch.js',
      'asset/raw/audio.js',
      'asset/raw/image.js',
      'asset/raw/video.js',
      'asset/shape/image.js',
      'asset/text/image.js',
      'clip/element.js',
      'control/asset.js',
      'control/boolean.js',
      'control/group/aspect.js',
      'control/group/dimensions.js',
      'control/group/fill.js',
      'control/group/location.js',
      'control/group/time.js',
      'control/numeric.js',
      'control/rgb.js',
      'control/string.js',
      'icon/fetch.js',
      ...[SourceRaw, SourceText].map(source => `asset/${source}/importer.js`),
    ].map(suffix => `./${suffix}`).join(',')
  }
  private _assetObject?: AssetObject 
  private get assetObject() { return this._assetObject }
  private set assetObject(assetObject: AssetObject | undefined) {
    // console.log(this.tagName, 'SET assetObject', assetObject)
    const { _assetObject: original } = this
    if (original === assetObject) return
    this._assetObject = assetObject

    if (assetObject) {
      this.masherPromise.then(() => {
        // console.log(this.tagName, 'SET assetObject masherPromise', assetObject)

        this.masher!.load(assetObject).then(() => {
          // console.log(this.tagName, 'masher DID load')
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
              // console.log(this.tagName, 'YES promise', assetObject, orError)
              this.assetObject = assetObject
            }
          })
        })
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
    return import('./asset/mash/MasherFactory.js').then(lib => {
      const { masherInstance } = lib
      this.masher = masherInstance()
    })

    // return this.sharedPromise.then(() => {
    //   // console.log(this.tagName, 'masherPromiseInitialize', rect)
    //   const options: MasherOptions = {}
    //   const masher = masherInstance(options)
    //   this.masher = masher
    //   // console.log(this.tagName, 'masherPromiseInitialize SET masher')
    // })
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
          icon='${this.icon}'
        >${slots}</movie-masher-viewer-section>
      `
      case FormSlotSelector: return html`
        <movie-masher-selector-section
          @export-parts='${this.handleExportParts}'
          part='${part}'
          icon='browser'
        >${slots}</movie-masher-selector-section>
      `
      case FormSlotComposer: return html`
        <movie-masher-composer-section
          @export-parts='${this.handleExportParts}'
          part='${part}'
          icon='timeline'
        >${slots}</movie-masher-composer-section>
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

  static override properties: PropertyDeclarations = {
    ...Slotted.properties,
    imports: { type: String },
    icon: { type: String },
  }

  static cssVariablesLayout = css`
    :host {
      --max-dimension: 480px;
      --ratio-preview: 0.25;
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


      --button-transition:
          background-color 0.25s ease-out,
          border-color 0.25s ease-out,
          color 0.25s ease-out;

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
        "preview media media"
        "compose compose inspect"
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
    
      /* 
      @media (max-width: 999px) {
        :host {
          display: block;
          grid-template-areas: "preview" "compose" "inspect" "media";
        }
      } */
      
  `

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    MovieMasherElement.cssVariables,
    MovieMasherElement.cssVariablesLayout,
    MovieMasherElement.cssDarkMediaQuery,
    MovieMasherElement.cssGrid,
    // css`
    //   :host {
    //     .panel .content {
    //       --padding: 20px;
    //       --spacing: 10px;
    //     }

    //     .panel .content .drop-box {
    //       pointer-events: none;
    //       position: absolute;
    //       top: 0px;
    //       left: 0px;
    //       bottom: 0px;
    //       right: 0px;
    //     }

    //     .panel .content.dropping .drop-box {
    //       box-shadow: var(--dropping-shadow);
    //     }
    
    //     .panel select {
    //       height: var(--button-size);
    //     }
    //   }
    // `
  ]
}

// register web component as custom element
customElements.define('movie-masher', MovieMasherElement)
