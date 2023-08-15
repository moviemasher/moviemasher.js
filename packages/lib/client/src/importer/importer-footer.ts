import type { AssetObjects } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { EventDialog, ImportAssetObjectsEvent, EventTypeImporterComplete, MovieMasher, EventImporterChange } from '@moviemasher/runtime-client'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import { html } from 'lit-html/lit-html.js'
import { Footer } from '../Base/LeftCenterRight.js'

export class ImporterFooterElement extends Footer {
  constructor() {
    super()
    this.listeners[EventImporterChange.Type] = this.handleImporterChange.bind(this)
    this.listeners[EventTypeImporterComplete] = this.handleImporterComplete.bind(this)
  }

  assetObjects: AssetObjects = []

  protected handleImporterComplete(): void {
    MovieMasher.eventDispatcher.dispatch(new EventDialog())

    const { assetObjects } = this
    MovieMasher.eventDispatcher.dispatch(new ImportAssetObjectsEvent(assetObjects))

  }

  protected handleImporterChange(event: EventImporterChange): void {
    const { detail: { assetObjects } } = event
    console.log(this.tagName, 'handleImporterChange', assetObjects)
    this.assetObjects = assetObjects
  }

  protected override leftContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-component-a')
    const htmls = [...slots]

    // no detail means close any current dialog
    htmls.push(html`
      <movie-masher-component-a
        icon='remove'
        emit='${EventDialog.Type}' 
      ></movie-masher-component-a>
    `)
    return super.leftContent(htmls)
  }

  protected override rightContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-component-button')
    const htmls = [...slots]
    const disabled = this.assetObjects.length ? undefined : true
    htmls.push(html`
      <movie-masher-component-button 
        icon='add'
        string='Import ${this.assetObjects.length}'
        emit='${EventTypeImporterComplete}' 
        disabled='${ifDefined(disabled ? true : undefined)}' 
      ></movie-masher-component-button>
    `)
    return super.rightContent(htmls)
  }


  static override properties: PropertyDeclarations = {
    ...Footer.properties,
    assetObjects: { type: Array, attribute: false }
  }
  
}

// register web component as custom element
customElements.define('movie-masher-importer-footer', ImporterFooterElement)