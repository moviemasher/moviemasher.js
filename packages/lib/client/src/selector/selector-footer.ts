import type { PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'
import type { AssetType } from '@moviemasher/runtime-shared'

import { TypesAsset } from '@moviemasher/runtime-shared'
import { EventDialog, EventTypeAssetType } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { Footer } from '../Base/LeftCenterRight.js'
import { ClassSelected } from '@moviemasher/lib-shared'

export class SelectorFooterElement extends Footer {
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
    TypesAsset.forEach(type => {
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
customElements.define('movie-masher-selector-footer', SelectorFooterElement)
