import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { ContentElement } from '../Base/LeftCenterRight.js'

const BrowserContentTag = 'movie-masher-browser-content'

export class BrowserContentElement extends ContentElement {
  override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-browser-content-center')
    htmls.push(html`<movie-masher-browser-content-center cover></movie-masher-browser-content-center>`) 
    return super.centerContent(htmls)
  }
}

// register web component as custom element
customElements.define(BrowserContentTag, BrowserContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserContentTag]: BrowserContentElement
  }
}
