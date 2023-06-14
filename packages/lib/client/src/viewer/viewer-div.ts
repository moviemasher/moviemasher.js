// import type { PropertyValues } from 'lit'
// import type { LocalClient } from '@moviemasher/lib-client'
// import type { Htmls, SlottedContent } from '../declarations.js'

import { customElement } from 'lit/decorators/custom-element.js'
// import { css } from 'lit'
import { Div } from '../Base/LeftCenterRight.js'
import { Htmls, OptionalContent, PreviewItemsEventDetail } from '../declarations.js'
import { html } from 'lit'
import { property } from 'lit/decorators/property.js'
import { EventTypeDraw, PreviewItems } from '@moviemasher/lib-shared'
import { MovieMasher } from '@moviemasher/runtime-client'

// import { consume } from '@lit-labs/context'

// import { clientContext } from '../Context/clientContext.js'
// import { ifDefined } from 'lit-html/directives/if-defined.js'


@customElement('movie-masher-viewer-div')
export class ViewerDivElement extends Div {
  constructor() {
    super()
    this.drawHandler = this.drawHandler.bind(this)
  }
  override centerContent(slots: Htmls): OptionalContent {
      const slotsCopy = [...slots]
      slotsCopy.push(html`${this.previewItems}`)
  //   const { client } = this
  //  slotsCopy.push(html`<span>${client?.constructor.name || '...'}</span>`)
    
    // this.importTags('movie-masher-icon')
    // slotsCopy.push(
    //   html`<movie-masher-icon 
    //     part='icon' slotted='icon'
    //     icon='play'
    //   ></movie-masher-icon>`
    // )
    
    return super.centerContent(slotsCopy)
  }

  override connectedCallback() {
    super.connectedCallback()
    MovieMasher.eventDispatcher.addDispatchListener(EventTypeDraw, this.drawHandler)
  }

  override disconnectedCallback() {
    super.disconnectedCallback()   
    MovieMasher.eventDispatcher.removeDispatchListener(EventTypeDraw, this.drawHandler)
  }

  private drawHandler(): void {
    delete this._previewItemsPromise
    this.requestUpdate()
  }

  override async getUpdateComplete(): Promise<boolean> {
    return super.getUpdateComplete().then(complete => {
      if (!complete) {
        console.log(this.constructor.name, 'getUpdateComplete SUPER', complete)
        return false
      }
      return this.previewItemsPromise.then(() => {  
        console.log(this.constructor.name, 'getUpdateComplete iconPromise', this.previewItems.length)
        // this.requestUpdate()
        return true
      })
    })
  }

  private _previewItemsPromise: Promise<PreviewItems> | undefined
  private get previewItemsPromise(): Promise<PreviewItems> {
    return this._previewItemsPromise ||= this.previewItemsPromiseInitialize
  }
  private get previewItemsPromiseInitialize(): Promise<PreviewItems> {
    const detail: PreviewItemsEventDetail = {}
    const init: CustomEventInit<PreviewItemsEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    const event = new CustomEvent<PreviewItemsEventDetail>('preview-items', init)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = detail
    if (!promise) return Promise.resolve([]) 

    return promise.then(items => this.previewItems = items)
  }


  @property({ attribute: false })
  previewItems: PreviewItems = []

  // override willUpdate(changedProperties: PropertyValues<this>) {
  //   if (changedProperties.has('client') && changedProperties.get('client')) {
  //     console.debug(this.constructor.name, 'willUpdate', changedProperties)
  //     this.requestUpdate()
  //   }
  // }
  

//   static override styles = [css`
//     :host {
//       display: block;


//       position: relative;
//       overflow: hidden;
//       /* border: var(--border);
//       border-radius: var(--border-radius);
//       border-color: var(--fore-secondary);
//       color: var(--fore-secondary);
//       background-color: var(--control-back); */   
//     }

//     div > span.center {
//       pointer-events: none;
//       width: var(--viewer-width);
//       height: var(--viewer-height);
//       margin-inline: auto;
//       color: var(--div-fore);
//       position: relative;
//     }

//     div > span.center > .svgs {
//       position: relative;
//     }


//     div > span.center > .svgs > svg,
//     div > span.center > .svgs > div {
//       position: absolute;
//       left: 0px;
//       top: 0px;
//     }

//     div > span.center > .svgs > svg.bounds,
//     div > span.center > .svgs > svg.background,
//     div > span.center > .svgs > svg.track {
//       pointer-events: none;
//     }

//     div > span.center > .svgs > svg .outline {
//       cursor: move;
//       pointer-events: fill;
//       stroke-width: 0;
//       fill: transparent;
//     }

//     div > span.center > .svgs > svg .outline.animate:hover {
//       stroke-width: calc(2 * var(--border-size));
//       stroke-dasharray: 4px;
//       stroke-dashoffset: 8px;
//       stroke: white;
//       animation: 
//         stroke 1s linear infinite forwards,
//         color 1s linear 0.5s infinite alternate;
//     }

//     @keyframes color { to {  stroke: black } }
//     @keyframes stroke { to { stroke-dashoffset: 0; } }



//     /* 
//     div > span.center > .svgs > svg.bounds .handle.ne {
//       cursor: ne-resize;
//     }
//     div > span.center > .svgs > svg.bounds .handle.se {
//       cursor: se-resize;
//     }
//     div > span.center > .svgs > svg.bounds .handle.nw {
//       cursor: nw-resize;
//     }
//     div > span.center > .svgs > svg.bounds .handle.sw {
//       cursor: sw-resize;
//     }
//     div > span.center > .svgs > svg.bounds .handle.n {
//       cursor: n-resize;
//     }
//     div > span.center > .svgs > svg.bounds .handle.s {
//       cursor: s-resize;
//     }
//     div > span.center > .svgs > svg.bounds .handle.e {
//       cursor: e-resize;
//     }
//     div > span.center > .svgs > svg.bounds .handle.w {
//       cursor: w-resize;
//     } */

//     div > span.center > .svgs > svg.bounds.back > * {
//       stroke-width: calc(2 * var(--border-size));

//       stroke: black;
//     }

//     div > span.center > .svgs > svg.bounds.back .handle {
//       pointer-events: fill;
//     }

//     div > span.center > .svgs > svg.bounds.fore > * {
//       stroke: none;
//       fill: white;
//     }
//   `]
    /* 
    @supports (-moz-appearance:none) {
      .moviemasher .preview.panel .content > .svgs > svg .filtered {
        filter: none;
      }
      .moviemasher .preview.panel .content > .svgs > svg use.mozilla  {
        stroke-width: var(--border-size);
        stroke: black;
        fill: white;
      }
    }
    @supports not (-moz-appearance:none) {
      .moviemasher .preview.panel .content > .svgs > svg use.mozilla {
        display: none;
      }
    } */
}
