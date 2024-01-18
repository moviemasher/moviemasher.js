import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'
import { CONTENTS, FOOTER, HEADER, Section } from '../base/LeftCenterRight.js'

export const InspectorTag = 'movie-masher-inspector'

/**
 * @category Elements
 */
export class InspectorElement extends Section {
  override contentContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-inspector-content')
    return html`<movie-masher-inspector-content
      part='${CONTENTS}' 
    >${htmls}</movie-masher-inspector-content>`
  }
    
  override footerContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-inspector-footer')
    return html`<movie-masher-inspector-footer
      part='${FOOTER}' 
    >${htmls}</movie-masher-inspector-footer>`
  }

  override headerContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-inspector-header')
    return html`<movie-masher-inspector-header
      part='${HEADER}' 
    >${htmls}</movie-masher-inspector-header>`
  }

  static override styles: CSSResultGroup = [
    Section.styles, 
    css`
      :host {
        grid-area: inspector;
      }
    `,
  ]
}

customElements.define(InspectorTag, InspectorElement)

declare global {
  interface HTMLElementTagNameMap {
    [InspectorTag]: InspectorElement
  }
}