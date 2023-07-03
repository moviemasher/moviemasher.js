import type { Htmls, OptionalContent } from '../declarations.js'
import type { AssetType } from '@moviemasher/runtime-shared'

import { TypesAsset } from '@moviemasher/runtime-shared'
import { MovieMasher, EventTypeDialog, EventTypeAssetType } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { Footer } from '../Base/LeftCenterRight.js'

export class SelectorFooterElement extends Footer {
  constructor() {
    super()
    this.handleAssetType = this.handleAssetType.bind(this)
  }

  assetType?: AssetType

  override connectedCallback(): void {
    super.connectedCallback()
    MovieMasher.eventDispatcher.addDispatchListener(EventTypeAssetType, this.handleAssetType)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    MovieMasher.eventDispatcher.removeDispatchListener(EventTypeAssetType, this.handleAssetType)
  }

  private handleAssetType(event: CustomEvent<AssetType>): void {
    const { detail: assetType } = event
    // console.log(this.tagName, 'handleAssetType', assetType)
    this.assetType = assetType
  }

  override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    const { assetType } = this
    const selected = assetType || '' 
    this.importTags('movie-masher-component-a')
    TypesAsset.forEach(type => {
      htmls.push(html`
        <movie-masher-component-a 
          class='${ifDefined(selected === type ? 'selected' : undefined)}' 
          icon='${type}' emit='${EventTypeAssetType}' detail='${type}'
        ></movie-masher-component-a>
      `)
    }) 
    return super.leftContent(htmls) 
  }

  override rightContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-component-a')
    return super.rightContent([
      ...slots, 
      html`<movie-masher-component-a
        slotted='input'
        icon='add' emit='${EventTypeDialog}' detail='importer'
      ></movie-masher-component-a>`,
    ])
  }

  static override properties = {
    ...Footer.properties,
    assetType: { type: String }
  }
}

// register web component as custom element
customElements.define('movie-masher-selector-footer', SelectorFooterElement)