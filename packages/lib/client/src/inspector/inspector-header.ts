import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { Header } from '../Base/LeftCenterRight.js'
import { ClientActionRedo, ClientActionUndo } from '@moviemasher/lib-shared'

export class InspectorHeaderElement extends Header {
  protected override rightContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-component-action')
    htmls.push(html`
      <movie-masher-component-action
        detail='${ClientActionUndo}'
        icon='undo'
      ></movie-masher-component-action>
    `)
    htmls.push(html`
      <movie-masher-component-action
        detail='${ClientActionRedo}'
        icon='redo'
      ></movie-masher-component-action>
    `)
    return super.rightContent(htmls)
  }
}

// register web component as custom element
customElements.define('movie-masher-inspector-header', InspectorHeaderElement)