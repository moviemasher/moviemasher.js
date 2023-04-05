import type { Htmls, Content, Contents, SlottedContent } from '../declarations.js'


import { customElement } from '@lit/reactive-element/decorators/custom-element.js'
import { html } from 'lit-html'

import { Header } from '../Base/LeftCenterRight.js'

@customElement('moviemasher-selector-header')
export class SelectorHeaderElement extends Header {
  override leftContent(slots: Htmls): SlottedContent {
    return super.leftContent(slots)
    // import((new URL('../icon.js', import.meta.url)).href)
    // return html`<moviemasher-icon 
    //   part='media-header-icon'
    //   icon='${this.icon}'
    // >${slots}</moviemasher-icon>`
  }

  override slottedContent(contents: Contents): Content {
    return html`<header 
      @connection='${this.onConnection}'
      @slotted='${this.onSlotted}'
    >${contents}</header>`
  }

  override rightContent(slots: Htmls): SlottedContent {
    return super.rightContent(slots)
    // import((new URL('../a.js', import.meta.url)).href)
    // const { icon } = this

    // return html`<moviemasher-a 
    //   exportparts='${ifDefined(this.exportsForSlot('right'))}'
    //   part='right' slotted='right'
    //   string='${icon}'
    //   emit='toggle'
    // ></moviemasher-a>`
  }
}
