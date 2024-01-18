import type { Htmls, OptionalContent } from '../client-types.js'

import { html } from 'lit-html'
import { ContentBase } from '../base/LeftCenterRight.js'

export const BrowserContentTag = 'movie-masher-browser-content'

/**
 * @category Elements
 */
export class BrowserContentElement extends ContentBase {
  override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.loadComponent('movie-masher-browser-content-center')
    htmls.push(html`<movie-masher-browser-content-center cover></movie-masher-browser-content-center>`) 
    return super.centerContent(htmls)
  }
}

customElements.define(BrowserContentTag, BrowserContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserContentTag]: BrowserContentElement
  }
}
