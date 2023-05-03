import type { Htmls, OptionalContent } from '../declarations.js'

import { customElement } from 'lit/decorators/custom-element.js'
import { css } from 'lit'
import { html } from 'lit'

import { Section } from '../Base/Section.js'

@customElement('movie-masher-viewer-section')
export class ViewerSectionElement extends Section {
  override divContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-viewer-div')
    return html`<movie-masher-viewer-div
      part='div' slotted='div'
    >${htmls}</movie-masher-viewer-div>`
  }

  override footerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-viewer-footer')
    return html`<movie-masher-viewer-footer
      part='footer' slotted='footer'
    >${htmls}</movie-masher-viewer-footer>`
  }

  override headerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-viewer-header')
    return html`<movie-masher-viewer-header 
      part='header' slotted='header'
      icon='${this.icon}' 
    >${htmls}</movie-masher-viewer-header>`
  }

  static override styles = [
    ...Section.styles, 
    css`
      :host {
        grid-area: preview;
      }
    `
  ]
}
