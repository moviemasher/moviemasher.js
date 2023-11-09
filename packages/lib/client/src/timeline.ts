import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from './declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { ContentSlot, FooterSlot, HeaderSlot, Section } from './Base/Section.js'

const TimelineTag = 'movie-masher-timeline'

export class TimelineElement extends Section {
  override contentContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-timeline-content')
    return html`<movie-masher-timeline-content
      part='${ContentSlot}' 
    >${htmls}</movie-masher-timeline-content>`
  }
    
  override footerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-timeline-footer')
    return html`<movie-masher-timeline-footer
      part='${FooterSlot}' 
    >${htmls}</movie-masher-timeline-footer>`
  }

  override headerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-timeline-header')
    return html`<movie-masher-timeline-header
      part='${HeaderSlot}' 
      icon='${this.icon}' 
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
customElements.define(TimelineTag, TimelineElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineTag]: TimelineElement
  }
}
