import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { Section } from '../Base/Section.js'

export const TimelineSectionName = 'movie-masher-timeline-section'

export class TimelineSectionElement extends Section {
  override divContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-timeline-div')
    return html`<movie-masher-timeline-div
      part='div'
    >${htmls}</movie-masher-timeline-div>`
  }
    
  override footerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-timeline-footer')
    return html`<movie-masher-timeline-footer
      part='footer'
    >${htmls}</movie-masher-timeline-footer>`
  }

  override headerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-timeline-header')
    return html`<movie-masher-timeline-header
      part='header' icon='${this.icon}' 
    >${htmls}</movie-masher-timeline-header>`
  }

  static override styles: CSSResultGroup = [
    Section.styles, 
    css`
      :host {
        grid-area: timeline;
      }
    `
  ]
}

// register web component as custom element
customElements.define(TimelineSectionName, TimelineSectionElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineSectionName]: TimelineSectionElement
  }
}
