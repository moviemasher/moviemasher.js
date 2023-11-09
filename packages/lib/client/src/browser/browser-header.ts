import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { HeaderElement } from '../Base/LeftCenterRight.js'

export const BrowserHeaderName = 'movie-masher-browser-header'

export class BrowserHeaderElement extends HeaderElement {
  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-browser-picker')

    htmls.push(html`
      <movie-masher-browser-picker
      ></movie-masher-browser-picker>
    `)
    
    return super.leftContent(htmls) 
  }

  // protected override rightContent(htmls: Htmls): OptionalContent {
  //   this.importTags('movie-masher-action-server')
  //   htmls.push(html`
  //     <movie-masher-action-server
  //       detail='${ServerActionEncode}'
  //       icon='${ServerActionEncode}'
  //       string='${ServerActionEncode}'
  //     ></movie-masher-action-server>
  //   `)
    
  //   return super.rightContent(htmls)
  // }
}

// register web component as custom element
customElements.define(BrowserHeaderName, BrowserHeaderElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserHeaderName]: BrowserHeaderElement
  }
}
