import type { Htmls, OptionalContent } from '../declarations.js'

import { ClientActionAdd, ClientActionAddTrack, EventDoClientAction } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { FooterElement } from '../Base/LeftCenterRight.js'

export const TimelineFooterName = 'movie-masher-timeline-footer'

export class TimelineFooterElement extends FooterElement {
  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-action-client')
    htmls.push(html`
      <movie-masher-action-client         
        icon='add' emit='${EventDoClientAction.Type}' detail='${ClientActionAdd}'
      ></movie-masher-action-client>
    `)
    htmls.push(html`
      <movie-masher-action-client 
        icon='track' emit='${EventDoClientAction.Type}' detail='${ClientActionAddTrack}'
      ></movie-masher-action-client>
    `)
    return super.leftContent(htmls)
  }

  protected override rightContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-timeline-zoom')
    htmls.push(html`<movie-masher-timeline-zoom></movie-masher-timeline-zoom>`)
    return super.rightContent(htmls)
  }
}

// register web component as custom element
customElements.define(TimelineFooterName, TimelineFooterElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineFooterName]: TimelineFooterElement
  }
}
