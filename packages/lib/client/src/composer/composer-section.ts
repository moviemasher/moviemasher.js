import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'


import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'

import { Section } from '../Base/Section.js'

export class ComposerSectionElement extends Section {
 
  override divContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-composer-div')
    return html`<movie-masher-composer-div
      part='div' slotted='div'
    >${htmls}</movie-masher-composer-div>`
  }
    
  override footerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-composer-footer')
    return html`<movie-masher-composer-footer
      part='footer' slotted='footer'
    >${htmls}</movie-masher-composer-footer>`
  }

  override headerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-composer-header')
    return html`<movie-masher-composer-header
      part='header' slotted='header'
      icon='${this.icon}' 
    >${htmls}</movie-masher-composer-header>`
  }

  static override styles: CSSResultGroup = [
    Section.styles, 
    css`
      :host {
        grid-area: compose;
      }
    `
  ]

}


// register web component as custom element
customElements.define('movie-masher-composer-section', ComposerSectionElement)