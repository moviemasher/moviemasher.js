import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { Div } from '../Base/LeftCenterRight.js'

export const BrowserDivName = 'movie-masher-browser-div'

export class BrowserDivElement extends Div {
  override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-browser-content')
    htmls.push(html`<movie-masher-browser-content cover></movie-masher-browser-content>`) 
    return super.centerContent(htmls)
  }
}

// register web component as custom element
customElements.define(BrowserDivName, BrowserDivElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserDivName]: BrowserDivElement
  }
}
