import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'

import { ClientActionAdd, ClientActionAddTrack } from '@moviemasher/runtime-client'
import { EventAction } from '@moviemasher/runtime-client'

import { Footer } from '../Base/LeftCenterRight.js'

export class ComposerFooterElement extends Footer {
  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-component-action')
    htmls.push(html`
      <movie-masher-component-action         
        icon='add' emit='${EventAction.Type}' detail='${ClientActionAdd}'
      ></movie-masher-component-action>
    `)
    htmls.push(html`
      <movie-masher-component-action 
        icon='track' emit='${EventAction.Type}' detail='${ClientActionAddTrack}'
      ></movie-masher-component-action>
    `)
    return super.leftContent(htmls)
  }

  protected override rightContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-composer-zoom')
    htmls.push(html`<movie-masher-composer-zoom></movie-masher-composer-zoom>`)
    return super.rightContent(htmls)
  }
}

// register web component as custom element
customElements.define('movie-masher-composer-footer', ComposerFooterElement)
