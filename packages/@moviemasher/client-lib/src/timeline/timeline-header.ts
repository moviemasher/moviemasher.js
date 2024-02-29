import type { Htmls, OptionalContent } from '../client-types.js'

import { VIEW } from '../runtime.js'
import { html } from 'lit-html'
import { HeaderBase } from '../base/component-view.js'
import { $ENCODE } from '@moviemasher/shared-lib/runtime.js'

export const TimelineHeaderTag = 'movie-masher-timeline-header'
/**
 * @category Elements
 */
export class TimelineHeaderElement extends HeaderBase {
  protected override rightContent(htmls: Htmls): OptionalContent {
    this.loadComponent('movie-masher-action-server')
    this.loadComponent('movie-masher-action-client')
    htmls.push(html`
      <movie-masher-action-server
        detail='${$ENCODE}'
        icon='${$ENCODE}'
        string='${$ENCODE}'
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
