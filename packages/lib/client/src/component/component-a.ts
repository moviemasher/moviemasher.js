import type { Contents, Content } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { IconString } from '../Base/IconString.js'

export class AElement extends IconString {
  
  protected override content(contents: Contents): Content {
    return html`<a 
      @click='${this.handleClick}'
      @export-parts='${this.handleExportParts}'
    >${contents}</a>`
  }
}

// register web component as custom element
customElements.define('movie-masher-component-a', AElement)
