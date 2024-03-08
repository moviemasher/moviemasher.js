import type { PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../client-types.js'

import { EventDialog } from '../module/event.js'
import { html } from 'lit-html'
import { FooterBase } from '../base/component-view.js'
import { $IMPORT } from '@moviemasher/shared-lib/runtime.js'
import { $INSERT } from '../utility/constants.js'

export const BrowserFooterTag = 'movie-masher-browser-footer'

/**
 * @category Elements
 */
export class BrowserFooterElement extends FooterBase {


  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.loadComponent('movie-masher-button')
    htmls.push(html`
      <movie-masher-button
        icon='${$INSERT}' emit='${EventDialog.Type}' 
        detail='importer'
        string='${$IMPORT}'
      ></movie-masher-button>
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

