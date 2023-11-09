import type { Htmls, OptionalContent } from '../declarations.js'

import { ClientActionTogglePaused, EventDoClientAction } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { FooterElement } from '../Base/LeftCenterRight.js'

const PlayerFooterTag = 'movie-masher-player-footer'
export class PlayerFooterElement extends FooterElement {
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
    this.importTags('movie-masher-player-slider')
    htmls.push(html`<movie-masher-player-slider></movie-masher-player-slider>`)

    return super.rightContent(htmls)
  }
}

// register web component as custom element
customElements.define(PlayerFooterTag, PlayerFooterElement)

declare global {
  interface HTMLElementTagNameMap {
    [PlayerFooterTag]: PlayerFooterElement
  }
}
