import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../client-types.js'

import { html } from 'lit-html'
import { CONTENTS, FOOTER, HEADER, Section } from '../base/component-view.js'

export const ImporterTag = 'movie-masher-importer'

/**
 * @category Elements
 */
export class ImporterElement extends Section {

  override contentContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-importer-content')
    return html`<movie-masher-importer-content
      part='${CONTENTS}' 
    >${htmls}</movie-masher-importer-content>`
  }
    
  override footerContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-importer-footer')
    return html`<movie-masher-importer-footer
      part='${FOOTER}' 
    >${htmls}</movie-masher-importer-footer>`
  }

  
  override headerContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-importer-header')
    return html`<movie-masher-importer-header
      part='${HEADER}' 
    >${htmls}</movie-masher-importer-header>`
  }
  static override properties: PropertyDeclarations = {
    ...Section.properties,
  }
  static override styles: CSSResultGroup = [
    Section.styles, 
  ]
}

customElements.define(ImporterTag, ImporterElement)

declare global {
  interface HTMLElementTagNameMap {
    [ImporterTag]: ImporterElement
  }
}
