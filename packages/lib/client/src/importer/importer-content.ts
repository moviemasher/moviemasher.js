import type { ClientImporter, ClientImporters, StringEvent } from '@moviemasher/runtime-client'
import type { CSSResultGroup, PropertyDeclarations, PropertyValueMap } from 'lit'
import type { Htmls, OptionalContent } from '../Types.js'

import { EventDialog, EventImportManagedAssets, EventImporterAdd, EventImporterComplete, EventImporterRemove, EventImporters, MOVIEMASHER } from '@moviemasher/runtime-client'
import { AssetObjects } from '@moviemasher/runtime-shared'
import { html, nothing } from 'lit-html'
import { CENTER, ContentBase } from '../base/LeftCenterRight.js'
import { css } from '@lit/reactive-element/css-tag.js'

const EventTypeImporter = 'importer'

const ImporterContentTag = 'movie-masher-importer-content'

/**
 * @category Component
 */
export class ImporterContentElement extends ContentBase {
  constructor() {
    super()
    this.listeners[EventTypeImporter] = this.handleImporter.bind(this)
    this.listeners[EventImporterAdd.Type] = this.handleImporterAdd.bind(this)
    this.listeners[EventImporterRemove.Type] = this.handleImporterRemove.bind(this)
    this.listeners[EventImporterComplete.Type] = this.handleImporterComplete.bind(this)
  }

  protected assetObjects: AssetObjects = []

  protected override centerContent(slots: Htmls): OptionalContent {
    const { importer } = this
    if (importer) {
      const { ui } = importer
      return html`<span 
        @export-parts='${this.handleExportParts}' 
        class='${CENTER}'
        part='${CENTER}'
      >${ui}</span>`
    }
    return super.centerContent(slots)
  }

   private handleImporter(event: StringEvent): void {
    const { detail: source } = event
    this.importerId = source
  }

  private handleImporterComplete(): void {
    MOVIEMASHER.eventDispatcher.dispatch(new EventDialog())

    const { assetObjects } = this
    this.assetObjects = []
    MOVIEMASHER.eventDispatcher.dispatch(new EventImportManagedAssets(assetObjects))
  }

  private handleImporterAdd(event: EventImporterAdd): void {
    const { detail: assetObjects } = event
    this.assetObjects = [...this.assetObjects, ...assetObjects]
  }

  private handleImporterRemove(event: EventImporterRemove): void {
    const { detail: id } = event
    
    this.assetObjects = this.assetObjects.filter(assetObject => assetObject.id !== id)
  }


  private get importer(): ClientImporter | undefined {
    const { importerId } = this
    if (!importerId) return 

    return this.importers.find(importer => importer.id === importerId)
  }

  importerId = ''

  private _importers?: ClientImporters

  private get importers(): ClientImporters {
    return this._importers ||= this.importersInitialize
  }

  private get importersInitialize(): ClientImporters {
    const importers: ClientImporters = []
    const event = new EventImporters(importers)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const [importer] = importers
    if (importer) this.importerId ||= importer.id
    return importers
  }

  private _importerElements?: Htmls

  private get importerElements(): Htmls {
    return this._importerElements ||= this.importerElementsInitialize
  }

  private get importerElementsInitialize(): Htmls {
    const { importers } = this
    if (importers.length < 2) return []

    const { importerId } = this

    this.importTags('movie-masher-component-a')

    return importers.map(importer => { 
      const { icon, id } = importer

      return html`
      <movie-masher-component-a 
        selected='${importerId === id || nothing}' 
        emit='${EventTypeImporter}' detail='${id}'
      >${icon}</movie-masher-component-a>`  
    })
  }

  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    const { importerElements } = this
    if (importerElements.length) htmls.push(html`${importerElements}`)

    return super.leftContent(htmls)
  }

  protected override rightContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    const { assetObjects } = this
    this.importTags('movie-masher-component-a')
    
    this.importTags('movie-masher-component-icon')

    htmls.push(...assetObjects.map(assetObject => {
      return html`
        <movie-masher-component-a
          icon='remove-circle'
          emit='${EventImporterRemove.Type}'
          detail='${assetObject.id}'
        ></movie-masher-component-a>
        <span>${assetObject.label}</span>
        <movie-masher-component-icon
          icon='${assetObject.type}'
        ></movie-masher-component-icon>
      `
    }))
    return super.rightContent(htmls)
  }

  protected override willUpdate(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has('importerId')) {
      delete this._importerElements
    }
  }

  static override properties: PropertyDeclarations = {
    ...ContentBase.properties,
    importerId: { type: String, attribute: 'importer-id' },
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

      .right > movie-masher-component-icon {
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

customElements.define(ImporterContentTag, ImporterContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [ImporterContentTag]: ImporterContentElement
  }
}
