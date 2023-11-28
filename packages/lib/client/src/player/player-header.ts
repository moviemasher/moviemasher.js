import type { Htmls, OptionalContent } from '../Types.js'

import { FLIP } from '@moviemasher/runtime-shared'
import { html } from 'lit-html'
import { HeaderBase } from '../base/LeftCenterRight.js'

const PlayerHeaderTag = 'movie-masher-player-header'
/**
 * @category Component
 */
export class PlayerHeaderElement extends HeaderBase {

  protected override leftContent(slots: Htmls): OptionalContent {
    this.importTag('movie-masher-control-input', 'movie-masher-controls')
    const htmls = [...slots]
    htmls.push(html`
      <movie-masher-action-client 
        icon='${FLIP}' detail='${FLIP}'
      ></movie-masher-action-client>
    `)
    return super.leftContent(htmls)
  }
  
  protected override rightContent(slots: Htmls): OptionalContent {
    this.importTag('movie-masher-control-input', 'movie-masher-controls')
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
