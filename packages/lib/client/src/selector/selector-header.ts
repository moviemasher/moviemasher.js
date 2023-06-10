import type { Htmls, Content, Contents, OptionalContent } from '../declarations.js'


import { customElement } from 'lit/decorators/custom-element.js'
import { html } from 'lit'

import { Header } from '../Base/LeftCenterRight.js'

@customElement('movie-masher-selector-header')
export class SelectorHeaderElement extends Header {
  override leftContent(slots: Htmls): OptionalContent {
    return super.leftContent(slots)
    // import((new URL('../icon.js', import.meta.url)).href)
    // return html`<movie-masher-icon 
    //   part='media-header-icon'
    //   icon='${this.icon}'
    // >${slots}</movie-masher-icon>`
  }

  protected override content(contents: Contents): Content {
    return html`<header 
      @connection='${this.connectionHandler}'
      @slotted='${this.slottedHandler}'
    >${contents}</header>`
  }

  override rightContent(slots: Htmls): OptionalContent {
    return super.rightContent(slots)
    // import((new URL('../a.js', import.meta.url)).href)
    // const { icon } = this

    // return html`<movie-masher-a 
    //   part='right' slotted='right'
    //   string='${icon}'
    //   emit='toggle'
    // ></movie-masher-a>`
  }
}
