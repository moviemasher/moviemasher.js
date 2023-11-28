import type { Htmls, OptionalContent } from '../Types.js'

import { html } from 'lit-html'
import { HeaderBase } from '../base/LeftCenterRight.js'

const BrowserHeaderTag = 'movie-masher-browser-header'

/**
 * @category Component
 */
export class BrowserHeaderElement extends HeaderBase {
  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-browser-picker')

    htmls.push(html`
      <movie-masher-browser-picker
      ></movie-masher-browser-picker>
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
