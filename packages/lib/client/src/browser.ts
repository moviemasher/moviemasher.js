import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from './declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { ContentSlot, FooterSlot, HeaderSlot, Section } from './Base/Section.js'

export const BrowserSectionName = 'movie-masher-browser'
export class BrowserSectionElement extends Section {
  override contentContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-browser-content')
    return html`<movie-masher-browser-content
      part='${ContentSlot}' 
    >${slots}</movie-masher-browser-content>`
  }
    
  override footerContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-browser-footer')
    return html`<movie-masher-browser-footer
      part='${FooterSlot}' 
    >${slots}</movie-masher-browser-footer>`
  }

  override headerContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-browser-header')
    return html`<movie-masher-browser-header
      part='${HeaderSlot}' 
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

// register web component as custom element
customElements.define(BrowserSectionName, BrowserSectionElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserSectionName]: BrowserSectionElement
  }
}
