import type { Content, Contents } from './declarations.js'

import { css } from 'lit'
import { html } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

import { Slotted } from './Base/Slotted.js'
import { Component } from './Base/Component.js'

@customElement('movie-masher-span')
export class SpanElement extends Slotted {

  protected override content(contents: Contents): Content {
    return html`<span 
      @connection='${this.connectionHandler}'
      @slotted='${this.slottedHandler}'
    >${contents}</span>`
  }

  static override styles = [
    Component.cssHostFlex,
    css`
      span {
        flex-grow: 1;
        white-space: nowrap;
        padding: var(--padding);
      }
    `
  ]
}
