import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from './Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'
import { CONTENTS, FOOTER, HEADER, Section } from './base/LeftCenterRight.js'

const MovieMasherPlayerTag = 'movie-masher-player'

/**
 * @category Component
 */
export class PlayerElement extends Section {
  override contentContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-player-content')
    return html`<movie-masher-player-content
      part='${CONTENTS}' 
    >${htmls}</movie-masher-player-content>`
  }

  override footerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-player-footer')
    return html`<movie-masher-player-footer
      part='${FOOTER}' 
    >${htmls}</movie-masher-player-footer>`
  }

  override headerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-player-header')
    return html`<movie-masher-player-header 
      part='${HEADER}' 
    >${htmls}</movie-masher-player-header>`
  }

  static override styles: CSSResultGroup = [
    Section.styles, 
    css`
      :host {
        grid-area: player;
      }
      section {
        grid-template-rows: var(--height-header) min-content var(--height-footer);
      }
    `
  ]
}

customElements.define(MovieMasherPlayerTag, PlayerElement)


declare global {
  interface HTMLElementTagNameMap {
    [MovieMasherPlayerTag]: PlayerElement
  }
}
