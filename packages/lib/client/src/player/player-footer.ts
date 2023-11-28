import type { Htmls, OptionalContent } from '../Types.js'

import { html } from 'lit-html'
import { FooterBase } from '../base/LeftCenterRight.js'

const PlayerFooterTag = 'movie-masher-player-footer'
/**
 * @category Component
 */
export class PlayerFooterElement extends FooterBase {
  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-player-button')
    this.importTags('movie-masher-player-range')
    htmls.push(html`<movie-masher-player-button></movie-masher-player-button>`)
    htmls.push(html`<movie-masher-player-range></movie-masher-player-range>`)
    return super.leftContent(htmls)
  }

  protected override rightContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-player-time')
    htmls.push(html`<movie-masher-player-time></movie-masher-player-time>`)
    return super.rightContent(htmls)
  }
}

customElements.define(PlayerFooterTag, PlayerFooterElement)

declare global {
  interface HTMLElementTagNameMap {
    [PlayerFooterTag]: PlayerFooterElement
  }
}
