import type { AssetType } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { ClassSelected, EventDialog, EventTypeAssetType } from '@moviemasher/runtime-client'
import { ASSET_TYPES } from '@moviemasher/runtime-shared'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import { html } from 'lit-html/lit-html.js'
import { Footer } from '../Base/LeftCenterRight.js'

export const BrowserFooterName = 'movie-masher-browser-footer'

export class BrowserFooterElement extends Footer {
  constructor() {
    super()
    this.listeners[EventTypeAssetType] = this.handleAssetType.bind(this)
  }

  assetType?: AssetType

  private handleAssetType(event: CustomEvent<AssetType>) {
    this.assetType = event.detail
  }

  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    const { assetType } = this
    const selected = assetType || '' 
    this.importTags('movie-masher-component-a')
    ASSET_TYPES.forEach(type => {
      htmls.push(html`
        <movie-masher-component-a 
          class='${ifDefined(selected === type ? ClassSelected : undefined)}' 
          icon='${type}' emit='${EventTypeAssetType}' detail='${type}'
        ></movie-masher-component-a>
      `)
    }) 
    return super.leftContent(htmls) 
  }

  protected override rightContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    htmls.push(html`
      <movie-masher-component-a
        icon='add' emit='${EventDialog.Type}' detail='importer'
      ></movie-masher-component-a>
    `)
    this.importTags('movie-masher-component-a')
    return super.rightContent(htmls)
  }

  static override properties: PropertyDeclarations = {
    ...Footer.properties,
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

