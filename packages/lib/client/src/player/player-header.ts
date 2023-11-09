import type { Htmls, OptionalContent } from '../declarations.js'

import { ClientActionFlip } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { HeaderElement } from '../Base/LeftCenterRight.js'


const PlayerHeaderTag = 'movie-masher-player-header'
export class PlayerHeaderElement extends HeaderElement {

  protected override leftContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-control-input')
    const htmls = [...slots]
    htmls.push(html`
      <movie-masher-action-client 
        icon='${ClientActionFlip}' detail='${ClientActionFlip}'
      ></movie-masher-action-client>
    `)
    return super.leftContent(htmls)
  }
  
  protected override rightContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-control-input')
    const htmls = [...slots]
    htmls.push(html`
      <movie-masher-control-input
        property-id='mash.color'
      ></movie-masher-control-input>
    `)
    return super.rightContent(htmls)
  }
}

// register web component as custom element
customElements.define(PlayerHeaderTag, PlayerHeaderElement)

declare global {
  interface HTMLElementTagNameMap {
    [PlayerHeaderTag]: PlayerHeaderElement
  }
}
