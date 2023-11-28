import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from './Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'
import { CONTENTS, FOOTER, HEADER, Section } from './base/LeftCenterRight.js'

const TimelineTag = 'movie-masher-timeline'

/**
 * @category Component
 */
export class TimelineElement extends Section {
  override contentContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-timeline-content')
    return html`<movie-masher-timeline-content
      part='${CONTENTS}' 
    >${htmls}</movie-masher-timeline-content>`
  }
    
  override footerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-timeline-footer')
    return html`<movie-masher-timeline-footer
      part='${FOOTER}' 
    >${htmls}</movie-masher-timeline-footer>`
  }

  override headerContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-timeline-header')
    return html`<movie-masher-timeline-header
      part='${HEADER}' 
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

customElements.define(TimelineTag, TimelineElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineTag]: TimelineElement
  }
}
