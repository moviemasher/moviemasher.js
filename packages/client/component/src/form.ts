import type { Masher, MashMedia } from '@moviemasher/lib-core'
import type { 
  RemoteClient, LocalClient, LocalClientOptions, RemoteClientOptions 
} from '@moviemasher/client-core'

import type { 
  InspectorFormSlot, ViewerFormSlot, SelectorFormSlot, ComposerFormSlot, 
  Contents, 
  Htmls, SlottedContent, IconEvent, TranlationEvent, Content, 
} from './declarations.js'


import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'
import { css } from 'lit'
import { html } from 'lit'
import { ifDefined } from 'lit/directives/if-defined.js'
import { provide } from '@lit-labs/context'

import { formContext, FormContext } from './Context/formContext.js'
import { masherContext } from './Context/masherContext.js'
import { mashMediaContext } from './Context/mashMediaContext.js'
import { Slotted } from './Base/Slotted.js'
import { remoteClientContext } from './Context/remoteClientContext.js'
import { localClientContext } from './Context/localClientContext.js'

const FormSlotInspector: InspectorFormSlot = 'inspector'
const FormSlotViewer: ViewerFormSlot = 'viewer'
const FormSlotSelector: SelectorFormSlot = 'selector'
const FormSlotComposer: ComposerFormSlot = 'composer'

/**
 * @prop (String) icon - id of icon to use for viewer section
 * @cssprop --hue - component of oklch base color
 * 
 * @tag moviemasher-form
 */
@customElement('moviemasher-form')
export class FormElement extends Slotted {
  @property({ type: String }) action = ''

  @property({ type: Boolean }) override autofocus = true


  private _clientPromise?: Promise<LocalClient | RemoteClient> 
  private get clientPromise() {
    return this._clientPromise ||= this.clientInitialize
  }
  
  private get clientInitialize(): Promise<LocalClient | RemoteClient> {
    const { translationSource } = this

    if (this.local) {
      return import('@moviemasher/client-core/esm/Client/LocalClientClass.js').then(lib => {
        const { localClientInstance } = lib
        const options: LocalClientOptions = {
          translationSource
        }
        const client = localClientInstance(options)
        this._clientPromise = Promise.resolve(client)
        return this.localClient = client
      })
    } 
    return import('@moviemasher/client-core/esm/Client/RemoteClientClass.js').then(lib => {
      const { remoteClientInstance } = lib
      // console.log('imported remote client', remoteClientInstance)
      const options: RemoteClientOptions = {
        translationSource
      }
      const client = remoteClientInstance(options)
      this._clientPromise = Promise.resolve(client)
      return this.localClient = this.remoteClient = client
    })
  }

  @provide({ context: localClientContext })
  @property()
  localClient: LocalClient | undefined



  @provide({ context: formContext })
  context: FormContext = {
    current: {},
    changeDefinition: () => {},
    // drop: () => Promise.resolve([]),
    editorIndex: {},
  }


  @property({ type: String }) icon = 'app'

  @property({ type: String }) iconSource = ''

  protected override defaultSlottedContent(name: string, htmls: Htmls): SlottedContent {
    this.importTags(`moviemasher-${name}-section`)
    
    switch(name) {
      case FormSlotInspector: {
        return html`<moviemasher-inspector-section
          exportparts='${ifDefined(this.exportsForSlot(name))}'
          part='${name}' slotted='${name}'
          icon='inspector'
        >${htmls}</moviemasher-inspector-section>`
      }
      case FormSlotViewer: {
        return html`<moviemasher-viewer-section 
          exportparts='${ifDefined(this.exportsForSlot(name))}'
          part='${name}' slotted='${name}'
          icon='${this.icon}'
        >${htmls}</moviemasher-viewer-section>`
      }
      case FormSlotSelector: {
        return html`<moviemasher-selector-section
          exportparts='${ifDefined(this.exportsForSlot(name))}'
          part='${name}' slotted='${name}'
          icon='browser'
        >${htmls}</moviemasher-selector-section>`
      }
      case FormSlotComposer: {
        return html`<moviemasher-composer-section
          exportparts='${ifDefined(this.exportsForSlot(name))}'
          part='${name}' slotted='${name}'
          icon='timeline'
        >${htmls}</moviemasher-composer-section>`
      }
    }
  }

  @property({ type: Boolean}) local = false

  @provide({ context: masherContext })
  @property()
  masher: Masher | undefined


  @provide({ context: mashMediaContext })
  @property()
  mashMedia: MashMedia | undefined

  // override async getUpdateComplete(): Promise<boolean> {
  //   return super.getUpdateComplete().then(() => {
  //     const bases = Array.from(this.childrenBySlot)
  //     const promises = bases.map(child => child.updateComplete)
  //     return Promise.all(promises).then(booleans => booleans.some(Boolean))
  //   })
  // }


  private onIcon(event: IconEvent) {
    const { detail } = event
    detail.promise = this.clientPromise.then(client => client.iconPromise(detail))
    event.stopPropagation()
  }

  private onTranslation(event: TranlationEvent) {
    const { detail } = event
    detail.promise = this.clientPromise.then(client => client.translationPromise(detail))
    event.stopPropagation()
  }

  private onToggle(event: CustomEvent<string>) {
    event.stopPropagation()
    const { masher } = this
    if (!masher) return

    const { detail } = event
    switch (detail) {
      case 'paused': {
        masher.paused = !masher.paused 
        break
      }
    }
  }

  @property({ type: Boolean }) readonly = false

  @provide({ context: remoteClientContext })
  @property()
  remoteClient: RemoteClient | undefined

  override slottedContent(contents: Contents): Content {
    return html`<form 
      @connection='${this.onConnection}'
      @slotted='${this.onSlotted}'
      @toggle='${this.onToggle}'
      @icon='${this.onIcon}'
      @string='${this.onTranslation}'
    >${contents}</form>`
  }

  override slots = [
    FormSlotViewer, 
    FormSlotSelector, 
    FormSlotInspector, 
    FormSlotComposer, 
  ]
  @property({ type: String }) translationSource = ''

  static styleBox = css`
    * {
      box-sizing: border-box;
    }
  `
  static styleFlex = css`
    :host {
      flex-grow: 1;
      display: flex;
    }
  `
  static styleVariables = css`
    :host {
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

      
      --border-size: 1px;
      --border: var(--border-size) solid;
      --border-radius: 5px;


      --padding: 40px;
      --spacing: 20px;
      --header-height: 38px;
      --footer-height: 38px;
      --viewer-aspect-ratio: 16 / 9;
      --icon-ratio: 0.25;
      --viewer-width: 480px;
      --viewer-height: 270px;
      --scrubber-height: 16px;
      --scrubber-width: 16px;
      --inspector-width: 240px;
      --track-width: 34px;
      --track-height: 60px;
      --icon-size: 24px;
      --button-size: 24px;
      
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



    label {
      height: var(--icon-size);
    }


    .panel select {
      height: var(--button-size);
    }
  }

  `
  static styleForm = css`
    form {
      flex-grow: 1;
      display: grid;
      gap: var(--gap);
      grid-template-areas: var(--areas);
      grid-template-columns: var(--columns);
      grid-template-rows: var(--rows);
    }
  `
  static styleHost = css`

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
  static override get styles() {
    return [
      FormElement.styleFlex,
      FormElement.styleVariables,
      FormElement.styleBox,
      FormElement.styleHost,
      FormElement.styleForm,
      FormElement.styleQueries,
      FormElement.styleIdk,

    ]
  }
}
      /* --div-back: oklch(var(--lightness-back-primary) 0 0); */
      /* --div-fore: yellow; */
      /* oklch(var(--lightness-fore-primary) 0 0); */
