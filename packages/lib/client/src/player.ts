import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from './declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { ContentSlot, FooterSlot, HeaderSlot, Section } from './Base/Section.js'

const MovieMasherPlayerTag = 'movie-masher-player'

export class PlayerElement extends Section {
  override contentContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-player-content')
    return html`<movie-masher-player-content
      part='${ContentSlot}' 
    >${htmls}</movie-masher-player-content>`
  }

  override footerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-player-footer')
    return html`<movie-masher-player-footer
      part='${FooterSlot}' 
    >${htmls}</movie-masher-player-footer>`
  }

  override headerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-player-header')
    return html`<movie-masher-player-header 
      part='${HeaderSlot}' 
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

// register web component as custom element
customElements.define(MovieMasherPlayerTag, PlayerElement)


declare global {
  interface HTMLElementTagNameMap {
    [MovieMasherPlayerTag]: PlayerElement
  }
}
