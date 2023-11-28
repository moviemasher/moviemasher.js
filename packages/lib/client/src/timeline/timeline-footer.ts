import type { Htmls, OptionalContent } from '../Types.js'

import { ADD, ADD_TRACK, EventDoClientAction, EventZoom, REMOVE } from '@moviemasher/runtime-client'
import { html } from 'lit-html'
import { FooterBase } from '../base/LeftCenterRight.js'

const TimelineFooterTag = 'movie-masher-timeline-footer'

/**
 * @category Component
 */
export class TimelineFooterElement extends FooterBase {

  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-timeline-range')
    this.importTags('movie-masher-component-a')
    htmls.push(html`<movie-masher-component-a
      icon='zoomLess' emit='${EventZoom.Type}' detail='0.001'
    ></movie-masher-component-a>`)
    htmls.push(html`<movie-masher-timeline-range></movie-masher-timeline-range>`)
    htmls.push(html`<movie-masher-component-a
      icon='zoomMore' emit='${EventZoom.Type}' detail='1'
    ></movie-masher-component-a>`)
    return super.leftContent(htmls)
  }

  protected override rightContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-action-client')
    htmls.push(html`
      <movie-masher-action-client         
        icon='add' emit='${EventDoClientAction.Type}' detail='${ADD}'
        string='clip'
      ></movie-masher-action-client>
    `)
    htmls.push(html`
      <movie-masher-action-client 
        icon='add' emit='${EventDoClientAction.Type}' detail='${ADD_TRACK}'
        string='track'
      ></movie-masher-action-client>
    `)

    this.importTags('movie-masher-action-client')
    htmls.push(html`
      <movie-masher-action-client
        detail='${REMOVE}'
        icon='remove'
      ></movie-masher-action-client>
    `)
    return super.rightContent(htmls)
  }
}

customElements.define(TimelineFooterTag, TimelineFooterElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineFooterTag]: TimelineFooterElement
  }
}
