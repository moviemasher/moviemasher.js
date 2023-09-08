import type { PropertyDeclarations } from 'lit'
import type { Content, Contents } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { IconString } from '../Base/IconString.js'

export const ButtonElementName = 'movie-masher-component-button'
export class ButtonElement extends IconString {
  protected override content(contents: Contents): Content {
    const title = this.icon || this.string
    return html`<button 
      title='${title}'
      ?disabled='${this.disabled}' 
      @export-parts='${this.handleExportParts}'
      @click='${this.handleClick}'
    >${contents}</button>`
  }

  protected disabled = false

  static override properties: PropertyDeclarations = {
    ...IconString.properties,
    disabled: { type: Boolean, attribute: false },
  }
}

// register web component as custom element
customElements.define(ButtonElementName, ButtonElement)

declare global {
  interface HTMLElementTagNameMap {
    [ButtonElementName]: ButtonElement
  }
}

