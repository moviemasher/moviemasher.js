import type { Htmls, OptionalContent } from '../Types.js'

import { html } from 'lit-html'
import { CENTER, ContentBase } from '../base/LeftCenterRight.js'

const InspectorContentTag = 'movie-masher-inspector-content'

/**
 * @category Component
 */
export class InspectorContentElement extends ContentBase {

  protected override centerContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-inspector-content-center')
    const htmls = [...slots]
    htmls.push(html`
      <movie-masher-inspector-content-center 
        @export-parts='${this.handleExportParts}' 
        class='${CENTER}'
        part='${CENTER}'
      >${slots}</movie-masher-inspector-content-center>
    `)
    return super.centerContent(htmls)
  }
}

customElements.define(InspectorContentTag, InspectorContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [InspectorContentTag]: InspectorContentElement
  }
}
