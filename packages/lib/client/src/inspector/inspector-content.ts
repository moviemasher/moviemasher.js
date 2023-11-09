import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { CenterSlot, ContentElement } from '../Base/LeftCenterRight.js'

const InspectorContentTag = 'movie-masher-inspector-content'

export class InspectorContentElement extends ContentElement {

  protected override centerContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-inspector-content-center')
    const htmls = [...slots]
    htmls.push(html`
      <movie-masher-inspector-content-center 
        @export-parts='${this.handleExportParts}' 
        class='${CenterSlot}'
        part='${CenterSlot}'
      >${slots}</movie-masher-inspector-content-center>
    `)
    return super.centerContent(htmls)
  }

}

// register web component as custom element
customElements.define(InspectorContentTag, InspectorContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [InspectorContentTag]: InspectorContentElement
  }
}
