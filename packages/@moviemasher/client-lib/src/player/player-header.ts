import type { Htmls, OptionalContent } from '../client-types.js'

import { $FLIP } from '@moviemasher/shared-lib/runtime.js'
import { html } from 'lit-html'
import { HeaderBase } from '../base/LeftCenterRight.js'

export const PlayerHeaderTag = 'movie-masher-player-header'
/**
 * @category Elements
 */
export class PlayerHeaderElement extends HeaderBase {

  protected override leftContent(slots: Htmls): OptionalContent {
    this.loadComponent('movie-masher-control-input')
    const htmls = [...slots]
    htmls.push(html`
      <movie-masher-action-client 
        icon='${$FLIP}' detail='${$FLIP}'
      ></movie-masher-action-client>
    `)
    return super.leftContent(htmls)
  }
  
  protected override rightContent(slots: Htmls): OptionalContent {
    this.loadComponent('movie-masher-control-input')
    const htmls = [...slots]
    htmls.push(html`<movie-masher-control-input
      property-id='mash.color'
    ></movie-masher-control-input>`)
    return super.rightContent(htmls)
  }
}

customElements.define(PlayerHeaderTag, PlayerHeaderElement)

declare global {
  interface HTMLElementTagNameMap {
    [PlayerHeaderTag]: PlayerHeaderElement
  }
}
