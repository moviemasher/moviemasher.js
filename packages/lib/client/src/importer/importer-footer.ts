import type { AssetObjects } from '@moviemasher/runtime-shared'
import type { Htmls, ImportAssetObjectsEvent, ImportAssetObjectsEventDetail, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { Footer } from '../Base/LeftCenterRight.js'
import { MovieMasher, EventTypeImportAssetObjects, EventTypeDialog, EventTypeImporterChange, EventTypeImporterComplete } from '@moviemasher/runtime-client'

export class InspectorFooterElement extends Footer {
  constructor() {
    super()
    this.handleImporterChange = this.handleImporterChange.bind(this)
    this.handleImporterComplete = this.handleImporterComplete.bind(this)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    MovieMasher.eventDispatcher.addDispatchListener(EventTypeImporterChange, this.handleImporterChange)
    MovieMasher.eventDispatcher.addDispatchListener(EventTypeImporterComplete, this.handleImporterComplete)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    MovieMasher.eventDispatcher.removeDispatchListener(EventTypeImporterChange, this.handleImporterChange)
    MovieMasher.eventDispatcher.removeDispatchListener(EventTypeImporterComplete, this.handleImporterComplete)
  }

  assetObjects: AssetObjects = []

  protected handleImporterComplete(): void {
    const { assetObjects } = this
    const detail: ImportAssetObjectsEventDetail = { assetObjects }
    const event = new CustomEvent(EventTypeImportAssetObjects, { detail })
    MovieMasher.eventDispatcher.dispatch(event)

    MovieMasher.eventDispatcher.dispatch(new CustomEvent(EventTypeDialog, { detail: 'close' }))
  }

  protected handleImporterChange(event:ImportAssetObjectsEvent): void {

    const { detail: { assetObjects } } = event
    console.log(this.tagName, 'handleImporterChange', assetObjects)
    this.assetObjects = assetObjects
  }

  override leftContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-component-a')
    const htmls = [...slots]
    htmls.push(html`<movie-masher-component-a
      icon='remove'
      emit='${EventTypeDialog}' detail='close'
    ></movie-masher-component-a>`)
    
    return super.leftContent(htmls)
  }

  override rightContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-component-button')
    const htmls = [...slots]
    const disabled = this.assetObjects.length ? undefined : true
    htmls.push(html`<movie-masher-component-button 
      icon='add'
      string='Import ${this.assetObjects.length}'
      emit='${EventTypeImporterComplete}' 
      disabled='${ifDefined(disabled ? true : undefined)}' 
    ></movie-masher-component-button>`)
    return super.rightContent(htmls)
  }


  static override properties = {
    ...Footer.properties,
    assetObjects: { type: Array, attribute: false }
  }
  
}


// register web component as custom element
customElements.define('movie-masher-importer-footer', InspectorFooterElement)