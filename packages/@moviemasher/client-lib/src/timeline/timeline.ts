import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'
import { CONTENTS, FOOTER, HEADER, Section } from '../base/LeftCenterRight.js'

export const TimelineTag = 'movie-masher-timeline'

/**
 * @category Elements
 */
export class TimelineElement extends Section {
  override contentContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-timeline-content')
    return html`<movie-masher-timeline-content
      part='${CONTENTS}' 
    >${htmls}</movie-masher-timeline-content>`
  }
    
  override footerContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-timeline-footer')
    return html`<movie-masher-timeline-footer
      part='${FOOTER}' 
    >${htmls}</movie-masher-timeline-footer>`
  }

  override headerContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-timeline-header')
    return html`<movie-masher-timeline-header
      part='${HEADER}' 
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
