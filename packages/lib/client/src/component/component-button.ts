import type { Contents, Content } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { IconString } from '../Base/IconString.js'

export class ButtonElement extends IconString {
  protected override content(contents: Contents): Content {
    return html`<button 
      disabled='${ifDefined(this.disabled ? 'true' : undefined)}' 
      @slotted='${this.slottedHandler}'
      @click='${this.clickHandler}'
    >${contents}</button>`
  }

  disabled = false

  static override properties = {
    ...IconString.properties,
    disabled: { type: Boolean }
  }
}

// register web component as custom element
customElements.define('movie-masher-component-button', ButtonElement)