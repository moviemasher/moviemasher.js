import type { PropertyDeclarations } from '@lit/reactive-element'
import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { ClientActionRedo, ClientActionUndo, ServerActionSave } from '@moviemasher/runtime-client'
import { FooterElement } from '../Base/LeftCenterRight.js'

export class InspectorFooterElement extends FooterElement {
  
  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-action-server')
    htmls.push(html`
      <movie-masher-action-server
        detail='${ServerActionSave}'
        icon='${ServerActionSave}'
        string='${ServerActionSave}'
      ></movie-masher-action-server>
    `)
    return super.leftContent(htmls)
  }

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
  
  static override properties: PropertyDeclarations = {
    ...FooterElement.properties,
  }
  
}

// register web component as custom element
customElements.define('movie-masher-inspector-footer', InspectorFooterElement)