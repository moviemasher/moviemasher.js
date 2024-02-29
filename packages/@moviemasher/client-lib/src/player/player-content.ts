import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'
import { CENTER, ContentBase } from '../base/component-view.js'

export const PlayerContentTag = 'movie-masher-player-content'

/**
 * @category Elements
 */
export class PlayerContentElement extends ContentBase {
  override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.loadComponent('movie-masher-player-content-center')
    htmls.push(html`<movie-masher-player-content-center
       class='${CENTER}'
       part='${CENTER}'
    ></movie-masher-player-content-center>`)
    return html`${htmls}`
  }

  static override styles: CSSResultGroup = [
    ContentBase.styles,
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
