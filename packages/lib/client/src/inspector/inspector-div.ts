import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'

import { Div } from '../Base/LeftCenterRight.js'

export class InspectorDivElement extends Div {

  protected override centerContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-inspector-content')
    const htmls = [...slots]
    htmls.push(html`
      <movie-masher-inspector-content 
        @export-parts='${this.handleExportParts}' 
        class='center'
        part='center'
      >${slots}</movie-masher-inspector-content>
    `)
    return super.centerContent(htmls)
  }

}


// register web component as custom element
customElements.define('movie-masher-inspector-div', InspectorDivElement)