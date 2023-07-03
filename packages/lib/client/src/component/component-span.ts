import type { CSSResultGroup } from 'lit'

import type { Content, Contents } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'

import { Component } from '../Base/Component.js'

export class SpanElement extends Component {

  protected override content(contents: Contents): Content {
    return html`<span 
    >${contents}</span>`
  }

  static override styles: CSSResultGroup = [
    Component.cssHostFlex,
    css`
      span {
        white-space: nowrap;
        display: flex;
        gap: var(--section-spacing);
        padding: var(--section-padding);
        flex-direction: var(--flex-direction);
      }
      span > * {
        margin: auto;
      }
    `
  ]
}


// register web component as custom element
customElements.define('movie-masher-component-span', SpanElement)