import type { Htmls, OptionalContent } from '../declarations.js'

import { ClientActionRemove } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { Header } from '../Base/LeftCenterRight.js'

export class ComposerHeaderElement extends Header {
  protected override rightContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-component-action')
    htmls.push(html`
      <movie-masher-component-action
        detail='${ClientActionRemove}'
        icon='remove'
      ></movie-masher-component-action>
    `)
    return super.rightContent(htmls)
  }
}

// register web component as custom element
customElements.define('movie-masher-composer-header', ComposerHeaderElement)
