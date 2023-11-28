import type { PropertyDeclarations } from '@lit/reactive-element'
import type { Htmls, OptionalContent } from '../Types.js'

import { html } from 'lit-html'
import { REDO, UNDO, SAVE } from '@moviemasher/runtime-client'
import { FooterBase } from '../base/LeftCenterRight.js'

const InspectorFooterTag = 'movie-masher-inspector-footer'
/**
 * @category Component
 */
export class InspectorFooterElement extends FooterBase {
  
  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]

    this.importTags('movie-masher-action-server')
    htmls.push(html`
      <movie-masher-action-server
        detail='${SAVE}'
        icon='${SAVE}'
        string='${SAVE}'
      ></movie-masher-action-server>
    `)
    return super.leftContent(htmls)
  }

  protected override rightContent(htmls: Htmls): OptionalContent {
    this.importTags('movie-masher-action-client')
    htmls.push(html`
      <movie-masher-action-client
        detail='${UNDO}'
        icon='${UNDO}'
        string='${UNDO}'
      ></movie-masher-action-client>
    `)
    htmls.push(html`
      <movie-masher-action-client
        detail='${REDO}'
        icon='${REDO}'
        string='${REDO}'
      ></movie-masher-action-client>
    `)
    return super.rightContent(htmls)
  }
  
  static override properties: PropertyDeclarations = {
    ...FooterBase.properties,
  }
  
}

customElements.define(InspectorFooterTag, InspectorFooterElement)