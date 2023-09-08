import type { Htmls, OptionalContent } from '../declarations.js'

import { ClientActionRemove } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { Header } from '../Base/LeftCenterRight.js'

export const TimelineHeaderName = 'movie-masher-timeline-header'
export class TimelineHeaderElement extends Header {
  protected override rightContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-action-client')
    htmls.push(html`
      <movie-masher-action-client
        detail='${ClientActionRemove}'
        icon='remove'
      ></movie-masher-action-client>
    `)
    return super.rightContent(htmls)
  }
}

// register web component as custom element
customElements.define(TimelineHeaderName, TimelineHeaderElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineHeaderName]: TimelineHeaderElement
  }
}
