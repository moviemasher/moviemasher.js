import type { PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { EventDialog } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { FooterElement } from '../Base/LeftCenterRight.js'

export const BrowserFooterName = 'movie-masher-browser-footer'

export class BrowserFooterElement extends FooterElement {


  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-component-a')
    htmls.push(html`
      <movie-masher-component-a
        icon='add' emit='${EventDialog.Type}' detail='importer'
      ></movie-masher-component-a>
    `)
    return super.leftContent(htmls)
  }

  static override properties: PropertyDeclarations = {
    ...FooterElement.properties,
    assetType: { type: String }
  }
}

// register web component as custom element
customElements.define(BrowserFooterName, BrowserFooterElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserFooterName]: BrowserFooterElement
  }
}

