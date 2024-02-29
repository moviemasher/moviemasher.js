import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../client-types.js'

import { html } from 'lit-html'
import { CONTENTS, FOOTER, HEADER, Section } from '../base/component-view.js'

export const ExporterTag = 'movie-masher-exporter'

/**
 * @category Elements
 */
export class ExporterElement extends Section {

  override contentContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-exporter-content')
    return html`<movie-masher-exporter-content
      part='${CONTENTS}' 
    >${htmls}</movie-masher-exporter-content>`
  }
    
  override footerContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-exporter-footer')
    return html`<movie-masher-exporter-footer
      part='${FOOTER}' 
    >${htmls}</movie-masher-exporter-footer>`
  }

  
  override headerContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-exporter-header')
    return html`<movie-masher-exporter-header
      part='${HEADER}' 
      icon='add' 
    >${htmls}</movie-masher-exporter-header>`
  }
  static override properties: PropertyDeclarations = {
    ...Section.properties,
  }
  static override styles: CSSResultGroup = [
    Section.styles, 
  ]
}

customElements.define(ExporterTag, ExporterElement)

declare global {
  interface HTMLElementTagNameMap {
    [ExporterTag]: ExporterElement
  }
}
