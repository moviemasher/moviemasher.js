import type { ClientExporter, ClientExporters } from '../types.js'
import type { CSSResultGroup, PropertyDeclarations, PropertyValueMap } from 'lit'
import type { Htmls, OptionalContent } from '../client-types.js'
import type { AssetObjects } from '@moviemasher/shared-lib/types.js'

import { MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventExporters } from '../module/event.js'
import { html, nothing } from 'lit-html'
import { CENTER, ContentBase } from '../base/component-view.js'
import { css } from '@lit/reactive-element/css-tag.js'

const EventTypeExporter = 'exporter'

export const ExporterContentTag = 'movie-masher-exporter-content'

/**
 * @category Elements
 */
export class ExporterContentElement extends ContentBase {
  constructor() {
    super()
    // this.listeners[EventTypeExporter] = this.handleExporter.bind(this)
    // this.listeners[EventExporterAdd.Type] = this.handleExporterAdd.bind(this)
    // this.listeners[EventExporterRemove.Type] = this.handleExporterRemove.bind(this)
    // this.listeners[EventExporterComplete.Type] = this.handleExporterComplete.bind(this)
  }

  protected assetObjects: AssetObjects = []

  protected override centerContent(slots: Htmls): OptionalContent {
    const { exporter } = this
    if (exporter) {
      const { ui } = exporter
      return html`<span 
        @export-parts='${this.handleExportParts}' 
        class='${CENTER}'
        part='${CENTER}'
      >${ui}</span>`
    }
    return super.centerContent(slots)
  }

  private get exporter(): ClientExporter | undefined {
    const { exporterId } = this
    if (!exporterId) return 

    return this.exporters.find(exporter => exporter.id === exporterId)
  }

  exporterId = ''

  private _exporters?: ClientExporters

  private get exporters(): ClientExporters {
    return this._exporters ||= this.exportersInitialize
  }

  private get exportersInitialize(): ClientExporters {
    const exporters: ClientExporters = []
    const event = new EventExporters(exporters)
    MOVIE_MASHER.dispatchCustom(event)
    const [exporter] = exporters
    if (exporter) this.exporterId ||= exporter.id
    return exporters
  }

  private _exporterElements?: Htmls

  private get exporterElements(): Htmls {
    return this._exporterElements ||= this.exporterElementsInitialize
  }

  private get exporterElementsInitialize(): Htmls {
    const { exporters } = this
    if (exporters.length < 2) return []

    const { exporterId } = this

    this.loadComponent('movie-masher-link')

    return exporters.map(exporter => { 
      const { icon, id } = exporter

      return html`
      <movie-masher-link 
        selected='${exporterId === id || nothing}' 
        emit='${EventTypeExporter}' detail='${id}'
      >${icon}</movie-masher-link>`  
    })
  }

  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    const { exporterElements } = this
    if (exporterElements.length) htmls.push(html`${exporterElements}`)

    return super.leftContent(htmls)
  }

  protected override rightContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    htmls.push(html`$RIGHT $CONTENT`)
    return super.rightContent(htmls)
  }

  protected override willUpdate(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has('exporterId')) {
      delete this._exporterElements
    }
  }

  static override properties: PropertyDeclarations = {
    ...ContentBase.properties,
    exporterId: { type: String, attribute: 'exporter-id' },
    assetObjects: { type: Array, attribute: false }
  }


  static override styles: CSSResultGroup = [
    ContentBase.styles,
    css`
      .right {
        max-width: 33%;
        --size: var(--height-control);
        display: grid;
        grid-template-columns: var(--size) 1fr var(--size);
        grid-auto-rows: var(--size);
        gap: var(--gap-control);
      }

      .right > movie-masher-icon {
        font-size: var(--size);
      }

      .right > span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `
  ]

}

customElements.define(ExporterContentTag, ExporterContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [ExporterContentTag]: ExporterContentElement
  }
}