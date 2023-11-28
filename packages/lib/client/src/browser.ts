import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from './Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'
import { CONTENTS, FOOTER, HEADER, Section } from './base/LeftCenterRight.js'

const BrowserTag = 'movie-masher-browser'
/**
 * @category Component
 */
export class BrowserElement extends Section {
  override contentContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-browser-content')
    return html`<movie-masher-browser-content
      part='${CONTENTS}' 
    >${slots}</movie-masher-browser-content>`
  }
    
  override footerContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-browser-footer')
    return html`<movie-masher-browser-footer
      part='${FOOTER}' 
    >${slots}</movie-masher-browser-footer>`
  }

  override headerContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-browser-header')
    return html`<movie-masher-browser-header
      part='${HEADER}' 
      icon='${this.icon}'
    >${slots}</movie-masher-browser-header>`
  } 

  static override styles: CSSResultGroup = [
    Section.styles, 
    css`
      :host {
        grid-area: browser;
      }
    `
  ]
}

customElements.define(BrowserTag, BrowserElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserTag]: BrowserElement
  }
}
