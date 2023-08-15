import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'

import { Section } from '../Base/Section.js'

export class ViewerSectionElement extends Section {
  override divContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-viewer-div')
    return html`<movie-masher-viewer-div
      part='div' 
    >${htmls}</movie-masher-viewer-div>`
  }

  override footerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-viewer-footer')
    return html`<movie-masher-viewer-footer
      part='footer' 
    >${htmls}</movie-masher-viewer-footer>`
  }

  override headerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-viewer-header')
    return html`<movie-masher-viewer-header 
      part='header' 
    >${htmls}</movie-masher-viewer-header>`
  }

  static override styles: CSSResultGroup = [
    Section.styles, 
    css`
      :host {
        grid-area: preview;
      }
      section {
        grid-template-rows: var(--header-height) min-content var(--footer-height);
      }
    `
  ]
}

// register web component as custom element
customElements.define('movie-masher-viewer-section', ViewerSectionElement)