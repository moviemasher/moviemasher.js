import type { PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../client-types.js'

import { html } from 'lit-html'
import { FooterBase } from '../base/component-view.js'

export const ExporterFooterTag = 'movie-masher-exporter-footer'
/**
 * @category Elements
 */
export class ExporterFooterElement extends FooterBase {
  constructor() {
    super()
    // this.listeners[EventExporterAdd.Type] = this.handleExporterAdd.bind(this)
    // this.listeners[EventExporterRemove.Type] = this.handleExporterRemove.bind(this)
    // this.listeners[EventExporterComplete.Type] = this.handleExporterComplete.bind(this)
  }

  count = 0

  protected override rightContent(slots: Htmls): OptionalContent {
    this.loadComponent('movie-masher-button')
    const htmls = [...slots]
    htmls.push(html`$RIGHT $CONTENT`)
    return super.rightContent(htmls)
  }


  static override properties: PropertyDeclarations = {
    ...FooterBase.properties,
    count: { type: Number, attribute: false }
  }
  
}

customElements.define(ExporterFooterTag, ExporterFooterElement)