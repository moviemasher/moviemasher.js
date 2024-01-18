import type { Htmls, OptionalContent } from '../client-types.js'

import { html } from 'lit-html'
import { HeaderBase } from '../base/LeftCenterRight.js'
import { BROWSER } from '../runtime.js'

export const BrowserHeaderTag = 'movie-masher-browser-header'

/**
 * @category Elements
 */
export class BrowserHeaderElement extends HeaderBase {
  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.loadComponent('movie-masher-picker')
    htmls.push(html`
      <movie-masher-picker picker='${BROWSER}'></movie-masher-picker>
    `)
    return super.leftContent(htmls) 
  }
}

customElements.define(BrowserHeaderTag, BrowserHeaderElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserHeaderTag]: BrowserHeaderElement
  }
}
