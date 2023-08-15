import type { Htmls, OptionalContent } from '../declarations.js'

import { ClientActionFlip } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { Header } from '../Base/LeftCenterRight.js'

export class ViewerHeaderElement extends Header {

  protected override leftContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-control-input')
    const htmls = [...slots]
    htmls.push(html`
      <movie-masher-component-action 
        icon='${ClientActionFlip}' detail='${ClientActionFlip}'
      ></movie-masher-component-action>
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
customElements.define('movie-masher-viewer-header', ViewerHeaderElement)