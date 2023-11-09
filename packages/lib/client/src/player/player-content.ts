import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { CenterSlot, ContentElement } from '../Base/LeftCenterRight.js'

const PlayerContentTag = 'movie-masher-player-content'

export class PlayerContentElement extends ContentElement {
  override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-player-content-center')
    htmls.push(html`<movie-masher-player-content-center
       class='${CenterSlot}'
       part='${CenterSlot}'
    ></movie-masher-player-content-center>`)
    return html`${htmls}`
  }

  static override styles: CSSResultGroup = [
    ContentElement.styles,
    css`
      .center {
        padding: 0;
      }
    `
  ]

}

// register web componemovie-masher-playert
customElements.define(PlayerContentTag, PlayerContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [PlayerContentTag]: PlayerContentElement
  }
}
