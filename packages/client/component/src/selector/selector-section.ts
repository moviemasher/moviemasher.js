import type { Htmls, OptionalContent } from '../declarations.js'

import { css } from 'lit'
import { html } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

import { Section } from '../Base/Section.js'

@customElement('movie-masher-selector-section')
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

  // protected override slots: string[] = ['footer']

  static override styles = [...Section.styles, css`
  
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

  `]
  
}
