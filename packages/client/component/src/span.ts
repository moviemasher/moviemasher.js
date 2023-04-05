import type { Content, Contents } from './declarations.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'

import { customElement } from '@lit/reactive-element/decorators/custom-element.js'
import { Slotted } from './Base/Slotted.js'

@customElement('moviemasher-span')
export class SpanElement extends Slotted {

  override slottedContent(contents: Contents): Content {
    return html`<span 
      @connection='${this.onConnection}'
      @slotted='${this.onSlotted}'
    >${contents}</span>`
  }

  static override styles = [css`
    :host {
      display: inline;
    }
    span {
      padding: var(--padding);
    }
  `]
}
