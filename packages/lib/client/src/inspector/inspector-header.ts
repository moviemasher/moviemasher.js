import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { HeaderElement } from '../Base/LeftCenterRight.js'

export class InspectorHeaderElement extends HeaderElement {

  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-inspector-picker')
    htmls.push(html`
      <movie-masher-inspector-picker
      ></movie-masher-inspector-picker>
    `)
    return super.leftContent(htmls)
  }

  // protected override rightContent(htmls: Htmls): OptionalContent {
  //   this.importTags('movie-masher-action-client')
  //   htmls.push(html`
  //     <movie-masher-action-client
  //       detail='${ClientActionUndo}'
  //       icon='${ClientActionUndo}'
  //       string='${ClientActionUndo}'
  //     ></movie-masher-action-client>
  //   `)
  //   htmls.push(html`
  //     <movie-masher-action-client
  //       detail='${ClientActionRedo}'
  //       icon='${ClientActionRedo}'
  //       string='${ClientActionRedo}'
  //     ></movie-masher-action-client>
  //   `)
  //   return super.rightContent(htmls)
  // }
}

// register web component as custom element
customElements.define('movie-masher-inspector-header', InspectorHeaderElement)