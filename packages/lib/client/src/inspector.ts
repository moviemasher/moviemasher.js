import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from './declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { ContentSlot, FooterSlot, HeaderSlot, Section } from './Base/Section.js'

const InspectorTag = 'movie-masher-inspector'

export class InspectorElement extends Section {
  override contentContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-inspector-content')
    return html`<movie-masher-inspector-content
      part='${ContentSlot}' 
    >${htmls}</movie-masher-inspector-content>`
  }
    
  override footerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-inspector-footer')
    return html`<movie-masher-inspector-footer
      part='${FooterSlot}' 
    >${htmls}</movie-masher-inspector-footer>`
  }

  override headerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-inspector-header')
    return html`<movie-masher-inspector-header
      part='${HeaderSlot}' 
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

// register web component as custom element
customElements.define(InspectorTag, InspectorElement)

declare global {
  interface HTMLElementTagNameMap {
    [InspectorTag]: InspectorElement
  }
}