import type { ClientImporter, ClientImporters, StringEvent } from '@moviemasher/runtime-client'
import type { PropertyDeclarations, PropertyValueMap } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { ClassSelected, MovieMasher } from '@moviemasher/runtime-client'
import { EventTypeImporters } from '@moviemasher/runtime-shared'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import { html } from 'lit-html/lit-html.js'
import { Div } from '../Base/LeftCenterRight.js'

const EventTypeImporter = 'importer'
export class ImporterDivElement extends Div {
  constructor() {
    super()
    this.listeners[EventTypeImporter] = this.handleImporter.bind(this)
  }

  protected override centerContent(slots: Htmls): OptionalContent {
    const { importer } = this
    if (importer) {
      const { ui } = importer
      return html`<span 
        @export-parts='${this.handleExportParts}' 
        class='center'
        part='center'
      >${ui}</span>`
    }
    return super.centerContent(slots)
  }

   protected handleImporter(event: StringEvent): void {
    const { detail: source } = event
    this.importerId = source
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
    const event = new CustomEvent(EventTypeImporters, { detail: { importers } })
    MovieMasher.eventDispatcher.dispatch(event)
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
    return importers.map(importer => { 
      const { icon, id } = importer
      return html`<movie-masher-component-a 
        class='${ifDefined(importerId === id ? ClassSelected : undefined)}' 
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

  protected override willUpdate(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has('importerId')) {
      delete this._importerElements
    }
  }


  static override properties: PropertyDeclarations = {
    ...Div.properties,
    importerId: { type: String, attribute: 'importer-id' }
  }

  
}


// register web component as custom element
customElements.define('movie-masher-importer-div', ImporterDivElement)