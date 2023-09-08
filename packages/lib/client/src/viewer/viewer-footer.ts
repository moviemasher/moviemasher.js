import type { Htmls, OptionalContent } from '../declarations.js'

import { EventDoClientAction, ClientActionTogglePaused } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { Footer } from '../Base/LeftCenterRight.js'

export class ViewerFooterElement extends Footer {
  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]

    
    this.importTags('movie-masher-action-client')
    htmls.push(html`<movie-masher-action-client
      icon='play' emit='${EventDoClientAction.Type}' detail='${ClientActionTogglePaused}'
    ></movie-masher-action-client>`)

    return super.leftContent(htmls)
  }

  protected override rightContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-viewer-slider')
    htmls.push(html`<movie-masher-viewer-slider></movie-masher-viewer-slider>`)

    return super.rightContent(htmls)
  }
}

// register web component as custom element
customElements.define('movie-masher-viewer-footer', ViewerFooterElement)