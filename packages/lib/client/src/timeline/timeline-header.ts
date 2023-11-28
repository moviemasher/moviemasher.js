import type { Htmls, OptionalContent } from '../Types.js'

import { VIEW } from '@moviemasher/runtime-client'
import { html } from 'lit-html'
import { HeaderBase } from '../base/LeftCenterRight.js'
import { ENCODE } from '@moviemasher/runtime-shared'

const TimelineHeaderTag = 'movie-masher-timeline-header'
/**
 * @category Component
 */
export class TimelineHeaderElement extends HeaderBase {
  protected override rightContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-action-server')
    this.importTags('movie-masher-action-client')
    htmls.push(html`
      <movie-masher-action-server
        detail='${ENCODE}'
        icon='${ENCODE}'
        string='${ENCODE}'
      ></movie-masher-action-server>
      <movie-masher-action-client
        icon='visible' 
        string='${VIEW}'
        detail='${VIEW}'
      ></movie-masher-action-client>
    `)
    return super.rightContent(htmls)
  }
}

customElements.define(TimelineHeaderTag, TimelineHeaderElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineHeaderTag]: TimelineHeaderElement
  }
}
