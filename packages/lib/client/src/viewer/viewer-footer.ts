import type { Htmls, OptionalContent } from '../declarations.js'

import { EventAction, ClientActionTogglePaused } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { Footer } from '../Base/LeftCenterRight.js'

export class ViewerFooterElement extends Footer {
  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]

    
    this.importTags('movie-masher-component-action')
    htmls.push(html`<movie-masher-component-action
      icon='play' emit='${EventAction.Type}' detail='${ClientActionTogglePaused}'
    ></movie-masher-component-action>`)

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