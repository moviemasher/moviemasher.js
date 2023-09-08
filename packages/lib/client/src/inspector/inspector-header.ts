import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { Header } from '../Base/LeftCenterRight.js'
import { ClientActionRedo, ClientActionUndo } from '@moviemasher/runtime-client'

export class InspectorHeaderElement extends Header {

  protected override rightContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-action-client')
    htmls.push(html`
      <movie-masher-action-client
        detail='${ClientActionUndo}'
        icon='${ClientActionUndo}'
        string='${ClientActionUndo}'
      ></movie-masher-action-client>
    `)
    htmls.push(html`
      <movie-masher-action-client
        detail='${ClientActionRedo}'
        icon='${ClientActionRedo}'
        string='${ClientActionRedo}'
      ></movie-masher-action-client>
    `)
    return super.rightContent(htmls)
  }
}

// register web component as custom element
customElements.define('movie-masher-inspector-header', InspectorHeaderElement)