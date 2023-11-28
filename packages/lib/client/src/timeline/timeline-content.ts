import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'
import { ContentBase } from '../base/LeftCenterRight.js'
import { Scroller } from '../base/LeftCenterRight.js'

const TimelineContentTag = 'movie-masher-timeline-content'

/**
 * @category Component
 */
export class TimelineContentElement extends ContentBase {
  protected override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]

    this.importTags('movie-masher-timeline-content-center')
    htmls.push(html`
      <movie-masher-timeline-content-center></movie-masher-timeline-content-center>
    `)
    return html`${htmls}`
  }
  
  static override styles: CSSResultGroup = [
    ContentBase.styles,
    Scroller.cssDivRoot,
    css`
      div.root {
        display: flex;
        overflow-y: auto;
      }
    `
  ]
}

customElements.define(TimelineContentTag, TimelineContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineContentTag]: TimelineContentElement
  }
}
