import type { PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { EventDialog, EventImporterComplete, EventImporterAdd, EventImporterRemove } from '@moviemasher/runtime-client'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import { html } from 'lit-html/lit-html.js'
import { FooterElement } from '../Base/LeftCenterRight.js'

export class ImporterFooterElement extends FooterElement {
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
        disabled='${ifDefined(count ? undefined : true)}' 
      ></movie-masher-component-button>
    `)
    return super.rightContent(htmls)
  }


  static override properties: PropertyDeclarations = {
    ...FooterElement.properties,
    count: { type: Number, attribute: false }
  }
  
}

// register web component as custom element
customElements.define('movie-masher-importer-footer', ImporterFooterElement)