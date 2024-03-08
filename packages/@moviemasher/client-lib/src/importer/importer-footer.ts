import type { PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../client-types.js'
import type { DefiniteError } from '@moviemasher/shared-lib/types.js'

import { EventDialog, EventImporterComplete, EventImporterAdd, EventImporterRemove, EventImporterError } from '../module/event.js'
import { html, nothing } from 'lit-html'
import { FooterBase } from '../base/component-view.js'
import { $INSERT } from '../utility/constants.js'

export const ImporterFooterTag = 'movie-masher-importer-footer'
/**
 * @category Elements
 */
export class ImporterFooterElement extends FooterBase {
  constructor() {
    super()
    this.listeners[EventImporterAdd.Type] = this.handleImporterAdd.bind(this)
    this.listeners[EventImporterRemove.Type] = this.handleImporterRemove.bind(this)
    this.listeners[EventImporterComplete.Type] = this.handleImporterComplete.bind(this)
    this.listeners[EventImporterError.Type] = this.handleImporterError.bind(this)
  }

  count = 0

  protected error?: DefiniteError

  private handleImporterComplete(): void { 
    this.count = 0
    this.error = undefined
  }
  private handleImporterError(event: EventImporterError): void { 
    this.error = event.detail
  }

  private handleImporterAdd(): void {
    this.count += 1
    this.error = undefined
  }

  private handleImporterRemove(): void {
    this.count -= 1
  }

  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    const { error } = this
    if (error) {
      this.loadComponent('movie-masher-word')

      htmls.push(html`<movie-masher-word string='${error.error.message}'></movie-masher-word>`)
    }
    return super.leftContent(htmls) 
  }

  protected override rightContent(slots: Htmls): OptionalContent {
    this.loadComponent('movie-masher-button')
    const htmls = [...slots]
    const { count } = this
    // no detail means close any current dialog
    htmls.push(html`<movie-masher-button
        emit='${EventDialog.Type}' 
        string='Cancel'
      ></movie-masher-button>`)
    htmls.push(html`<movie-masher-button 
        icon='${$INSERT}'
        string='Import ${count || ''}'
        emit='${EventImporterComplete.Type}' 
        disabled='${count ? nothing : true}' 
      ></movie-masher-button>`)
    return super.rightContent(htmls)
  }


  static override properties: PropertyDeclarations = {
    ...FooterBase.properties,
    error: { type: Object, attribute: false },
    count: { type: Number, attribute: false }
  }
  
}

customElements.define(ImporterFooterTag, ImporterFooterElement)