import type { Htmls, OptionalContent } from '../declarations.js'

import { ServerActionEncode, ServerActionSave } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { Header } from '../Base/LeftCenterRight.js'

export const BrowserHeaderName = 'movie-masher-browser-header'

export class BrowserHeaderElement extends Header {
  protected override rightContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-action-server')
    htmls.push(html`
      <movie-masher-action-server
        detail='${ServerActionEncode}'
        icon='${ServerActionEncode}'
        string='${ServerActionEncode}'
        progress='replace-string'
        progress-width='string'
      ></movie-masher-action-server>
    `)
    htmls.push(html`
      <movie-masher-action-server
        detail='${ServerActionSave}'
        icon='${ServerActionSave}'
        string='${ServerActionSave}'
        progress='replace-string'
        progress-width='string'
      ></movie-masher-action-server>
    `)
    return super.rightContent(htmls)
  }
}

// register web component as custom element
customElements.define(BrowserHeaderName, BrowserHeaderElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserHeaderName]: BrowserHeaderElement
  }
}
