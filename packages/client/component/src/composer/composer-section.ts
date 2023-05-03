import type { Htmls, OptionalContent } from '../declarations.js'

// import { ifDefined } from 'lit/directives/if-defined.js'

import { customElement } from 'lit/decorators/custom-element.js'
import { css } from 'lit'
import { html } from 'lit'

import { Section } from '../Base/Section.js'

@customElement('movie-masher-composer-section')
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

  static override styles = [
    ...Section.styles, 
    css`
      :host {
        grid-area: compose;
      }
    `
  ]

}
