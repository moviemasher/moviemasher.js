import type { Htmls, OptionalContent } from '../client-types.js'

import { ADD, ADD_TRACK, REMOVE } from '../runtime.js'
import { EventDoClientAction, EventZoom } from '../utility/events.js'
import { html } from 'lit-html'
import { FooterBase } from '../base/component-view.js'

export const TimelineFooterTag = 'movie-masher-timeline-footer'

/**
 * @category Elements
 */
export class TimelineFooterElement extends FooterBase {

  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.loadComponent('movie-masher-timeline-range')
    this.loadComponent('movie-masher-link')
    htmls.push(html`<movie-masher-link
      icon='zoomLess' emit='${EventZoom.Type}' detail='0.001'
    ></movie-masher-link>`)
    htmls.push(html`<movie-masher-timeline-range></movie-masher-timeline-range>`)
    htmls.push(html`<movie-masher-link
      icon='zoomMore' emit='${EventZoom.Type}' detail='1'
    ></movie-masher-link>`)
    return super.leftContent(htmls)
  }

  protected override rightContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.loadComponent('movie-masher-action-client')
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

    this.loadComponent('movie-masher-action-client')
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
