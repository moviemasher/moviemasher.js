import type { PropertyDeclarations } from '@lit/reactive-element'
import type { Htmls, OptionalContent } from '../client-types.js'

import { html } from 'lit-html'
import { REDO, UNDO, SAVE } from '../runtime.js'
import { FooterBase } from '../base/LeftCenterRight.js'

export const InspectorFooterTag = 'movie-masher-inspector-footer'
/**
 * @category Elements
 */
export class InspectorFooterElement extends FooterBase {
  
  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]

    this.loadComponent('movie-masher-action-server')
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
    this.loadComponent('movie-masher-action-client')
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