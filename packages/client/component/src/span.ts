import type { Content, Contents } from './declarations.js'

import { css } from 'lit'
import { html } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

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
