import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'
import { ContentElement } from '../Base/LeftCenterRight.js'
import { Scroller } from '../Base/Scroller.js'

const TimelineContentTag = 'movie-masher-timeline-content'

export class TimelineContentElement extends ContentElement {
  protected override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]

    this.importTags('movie-masher-timeline-content-center')
    htmls.push(html`
      <movie-masher-timeline-content-center></movie-masher-timeline-content-center>
    `)
    return html`${htmls}`
  }
  
  static override styles: CSSResultGroup = [
    ContentElement.styles,
    Scroller.cssDivRoot,
    css`
      div.root {
        display: flex;
        overflow-y: auto;
      }
    `
  ]
}

// register web component as custom element
customElements.define(TimelineContentTag, TimelineContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineContentTag]: TimelineContentElement
  }
}
