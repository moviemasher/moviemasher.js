import type { PropertyValues } from 'lit'
import type { LocalClient } from '@moviemasher/client-core'
import type { Htmls, SlottedContent } from '../declarations.js'

import { customElement } from 'lit/decorators/custom-element.js'
import { css, html } from 'lit'
import { Div } from '../Base/LeftCenterRight.js'
import { consume } from '@lit-labs/context'

import { localClientContext } from '../Context/localClientContext.js'
// import { ifDefined } from 'lit-html/directives/if-defined.js'
import { property } from 'lit/decorators/property.js'


@customElement('moviemasher-viewer-div')
export class ViewerDivElement extends Div {
  @consume({context: localClientContext, subscribe: true })
  @property({ attribute: false })
  localClient?: LocalClient

  protected override leftContent(htmls: Htmls): SlottedContent {
    const slotsCopy = [...htmls]
    const { localClient } = this
   slotsCopy.push(html`<span>${localClient?.constructor.name || '...'}</span>`)
    
    // this.importTags('moviemasher-icon')
    // slotsCopy.push(
    //   html`<moviemasher-icon 
    //     exportparts='${ifDefined(this.exportsForSlot('icon'))}'
    //     part='icon' slotted='icon'
    //     icon='play'
    //   ></moviemasher-icon>`
    // )
    
    return super.leftContent(slotsCopy)
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('localClient') && changedProperties.get('localClient')) {
      console.debug(this.constructor.name, 'willUpdate', changedProperties)
      this.requestUpdate()
    }
  }
  

  static override styles = [css`
    :host {
      display: block;


      position: relative;
      overflow: hidden;
      /* border: var(--border);
      border-radius: var(--border-radius);
      border-color: var(--fore-secondary);
      color: var(--fore-secondary);
      background-color: var(--control-back); */
 
/* 
    .panel .preview label {
        --padding: 5px;
      position: absolute;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
      background-color: var(--div-back);
      opacity: 0.5;
      height: calc(var(--icon-size));
      padding: var(--padding);
    }

     */
      
    }

    div > span.center {
      pointer-events: none;
      width: var(--viewer-width);
      height: var(--viewer-height);
      margin-inline: auto;
      color: var(--div-fore);
      position: relative;
    }

    div > span.center > .svgs {
      position: relative;
    }


    div > span.center > .svgs > svg,
    div > span.center > .svgs > div {
      position: absolute;
      left: 0px;
      top: 0px;
    }

    div > span.center > .svgs > svg.bounds,
    div > span.center > .svgs > svg.background,
    div > span.center > .svgs > svg.track {
      pointer-events: none;
    }

    div > span.center > .svgs > svg .outline {
      cursor: move;
      pointer-events: fill;
      stroke-width: 0;
      fill: transparent;
    }

    div > span.center > .svgs > svg .outline.animate:hover {
      stroke-width: calc(2 * var(--border-size));
      stroke-dasharray: 4px;
      stroke-dashoffset: 8px;
      stroke: white;
      animation: 
        stroke 1s linear infinite forwards,
        color 1s linear 0.5s infinite alternate;
    }

    @keyframes color { to {  stroke: black } }
    @keyframes stroke { to { stroke-dashoffset: 0; } }



    /* 
    div > span.center > .svgs > svg.bounds .handle.ne {
      cursor: ne-resize;
    }
    div > span.center > .svgs > svg.bounds .handle.se {
      cursor: se-resize;
    }
    div > span.center > .svgs > svg.bounds .handle.nw {
      cursor: nw-resize;
    }
    div > span.center > .svgs > svg.bounds .handle.sw {
      cursor: sw-resize;
    }
    div > span.center > .svgs > svg.bounds .handle.n {
      cursor: n-resize;
    }
    div > span.center > .svgs > svg.bounds .handle.s {
      cursor: s-resize;
    }
    div > span.center > .svgs > svg.bounds .handle.e {
      cursor: e-resize;
    }
    div > span.center > .svgs > svg.bounds .handle.w {
      cursor: w-resize;
    } */

    div > span.center > .svgs > svg.bounds.back > * {
      stroke-width: calc(2 * var(--border-size));

      stroke: black;
    }

    div > span.center > .svgs > svg.bounds.back .handle {
      pointer-events: fill;
    }

    div > span.center > .svgs > svg.bounds.fore > * {
      stroke: none;
      fill: white;
    }
  `]
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
