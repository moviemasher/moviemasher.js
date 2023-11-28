import type { PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../Types.js'

import { EventDialog, EventImporterComplete, EventImporterAdd, EventImporterRemove } from '@moviemasher/runtime-client'
import { html, nothing } from 'lit-html'
import { FooterBase } from '../base/LeftCenterRight.js'

const ImporterFooterTag = 'movie-masher-importer-footer'
/**
 * @category Component
 */
export class ImporterFooterElement extends FooterBase {
  constructor() {
    super()
    this.listeners[EventImporterAdd.Type] = this.handleImporterAdd.bind(this)
    this.listeners[EventImporterRemove.Type] = this.handleImporterRemove.bind(this)
    this.listeners[EventImporterComplete.Type] = this.handleImporterComplete.bind(this)
  }

  count = 0

  private handleImporterComplete(): void { 
    this.count = 0
  }

  private handleImporterAdd(event: EventImporterAdd): void {
    const { detail: assetObjects } = event
    this.count += assetObjects.length
  }

  private handleImporterRemove(): void {
    this.count -= 1
  }

  protected override rightContent(slots: Htmls): OptionalContent {
    this.importTags('movie-masher-component-button')
    const htmls = [...slots]
    const { count } = this
    // no detail means close any current dialog
    htmls.push(html`
      <movie-masher-component-button
        emit='${EventDialog.Type}' 
        string='Cancel'
      ></movie-masher-component-button>
    `)
    htmls.push(html`
      <movie-masher-component-button 
        icon='add'
        string='Import ${count}'
        emit='${EventImporterComplete.Type}' 
        disabled='${count ? nothing : true}' 
      ></movie-masher-component-button>
    `)
    return super.rightContent(htmls)
  }


  static override properties: PropertyDeclarations = {
    ...FooterBase.properties,
    count: { type: Number, attribute: false }
  }
  
}

customElements.define(ImporterFooterTag, ImporterFooterElement)