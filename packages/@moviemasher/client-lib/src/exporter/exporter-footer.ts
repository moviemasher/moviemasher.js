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

  // private handleExporterComplete(): void { 
  //   this.count = 0
  // }

  // private handleExporterAdd(event: EventExporterAdd): void {
  //   const { detail: assetObjects } = event
  //   this.count += assetObjects.length
  // }

  // private handleExporterRemove(): void {
  //   this.count -= 1
  // }

  protected override rightContent(slots: Htmls): OptionalContent {
    this.loadComponent('movie-masher-button')
    const htmls = [...slots]
    htmls.push(html`$RIGHT $CONTENT`)
    // const { count } = this
    // no detail means close any current dialog
    // htmls.push(html`
    //   <movie-masher-button
    //     emit='${EventDialog.Type}' 
    //     string='Cancel'
    //   ></movie-masher-button>
    // `)
    // htmls.push(html`
    //   <movie-masher-button 
    //     icon='add'
    //     string='Import ${count}'
    //     emit='${EventExporterComplete.Type}' 
    //     disabled='${count ? nothing : true}' 
    //   ></movie-masher-button>
    // `)
    return super.rightContent(htmls)
  }


  static override properties: PropertyDeclarations = {
    ...FooterBase.properties,
    count: { type: Number, attribute: false }
  }
  
}

customElements.define(ExporterFooterTag, ExporterFooterElement)