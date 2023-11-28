import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from './Types.js'

import { html } from 'lit-html'
import { CONTENTS, FOOTER, HEADER, Section } from './base/LeftCenterRight.js'

const ImporterTag = 'movie-masher-importer'

/**
 * @category Component
 */
export class ImporterElement extends Section {

  override contentContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-importer-content')
    return html`<movie-masher-importer-content
      part='${CONTENTS}' 
    >${htmls}</movie-masher-importer-content>`
  }
    
  override footerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-importer-footer')
    return html`<movie-masher-importer-footer
      part='${FOOTER}' 
    >${htmls}</movie-masher-importer-footer>`
  }

  
  override headerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-importer-header')
    return html`<movie-masher-importer-header
      part='${HEADER}' 
      icon='add' 
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
