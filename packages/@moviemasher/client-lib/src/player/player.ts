import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'
import { CONTENTS, FOOTER, HEADER, Section } from '../base/component-view.js'

export const PlayerTag = 'movie-masher-player'

/**
 * @category Elements
 */
export class PlayerElement extends Section {
  override contentContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-player-content')
    return html`<movie-masher-player-content
      part='${CONTENTS}' 
    >${htmls}</movie-masher-player-content>`
  }

  override footerContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-player-footer')
    return html`<movie-masher-player-footer
      part='${FOOTER}' 
    >${htmls}</movie-masher-player-footer>`
  }

  override headerContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-player-header')
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

customElements.define(PlayerTag, PlayerElement)


declare global {
  interface HTMLElementTagNameMap {
    [PlayerTag]: PlayerElement
  }
}
