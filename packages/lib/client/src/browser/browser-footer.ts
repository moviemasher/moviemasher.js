import type { PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../Types.js'

import { EventDialog, IMPORT } from '@moviemasher/runtime-client'
import { html } from 'lit-html'
import { FooterBase } from '../base/LeftCenterRight.js'

const BrowserFooterTag = 'movie-masher-browser-footer'

/**
 * @category Component
 */
export class BrowserFooterElement extends FooterBase {


  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-component-button')
    htmls.push(html`
      <movie-masher-component-button
        icon='add' emit='${EventDialog.Type}' 
        detail='importer'
        string='${IMPORT}'
      ></movie-masher-component-button>
    `)
    return super.leftContent(htmls)
  }

  static override properties: PropertyDeclarations = {
    ...FooterBase.properties,
    assetType: { type: String }
  }
}

customElements.define(BrowserFooterTag, BrowserFooterElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserFooterTag]: BrowserFooterElement
  }
}

