import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'

import { Section } from '../Base/Section.js'

export class SelectorSectionElement extends Section {
  override divContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-selector-div')
    return html`<movie-masher-selector-div
      part='div' slotted='div'
    >${slots}</movie-masher-selector-div>`
  }
    
  override footerContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-selector-footer')
    return html`<movie-masher-selector-footer
      part='footer' slotted='footer'
    >${slots}</movie-masher-selector-footer>`
  }

  override headerContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-selector-header')
    return html`<movie-masher-selector-header
      icon='${this.icon}'
      part='header' slotted='header'
    >${slots}</movie-masher-selector-header>`
  } 

  static override styles: CSSResultGroup = [
    Section.styles, 
    css`
      /* media.css */
      :host {
        grid-area: media;
      }

      .panel.media footer label {
        text-align: right;
        flex-grow: 1;
      }
      .media label > svg:hover {
        color: var(--control-fore-hover);
      }

    `
  ]
}

// register web component as custom element
customElements.define('movie-masher-selector-section', SelectorSectionElement)