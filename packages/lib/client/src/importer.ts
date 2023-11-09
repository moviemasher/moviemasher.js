import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from './declarations.js'

import { html } from 'lit-html/lit-html.js'
import { ContentSlot, FooterSlot, HeaderSlot, Section } from './Base/Section.js'

const ImporterTag = 'movie-masher-importer'

export class ImporterElement extends Section {

  override contentContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-importer-content')
    return html`<movie-masher-importer-content
      part='${ContentSlot}' 
    >${htmls}</movie-masher-importer-content>`
  }
    
  override footerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-importer-footer')
    return html`<movie-masher-importer-footer
      part='${FooterSlot}' 
    >${htmls}</movie-masher-importer-footer>`
  }

  
  override headerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-importer-header')
    return html`<movie-masher-importer-header
      part='${HeaderSlot}' 
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

// register web component as custom element
customElements.define(ImporterTag, ImporterElement)

declare global {
  interface HTMLElementTagNameMap {
    [ImporterTag]: ImporterElement
  }
}
