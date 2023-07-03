import type { StringEvent } from '@moviemasher/runtime-shared'
import type { ClientImporters, ClientImporter } from '@moviemasher/runtime-client'
import type { PropertyValueMap } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { EventTypeImporters } from '@moviemasher/runtime-shared'
import { MovieMasher } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { Div } from '../Base/LeftCenterRight.js'


export class InspectorDivElement extends Div {
  constructor() {
    super()
    this.handleImporter = this.handleImporter.bind(this)
  }

  protected override centerContent(slots: Htmls): OptionalContent {
    const { importer } = this
    if (importer) {
      const { ui } = importer
      return html`<span class='center'>${ui}</span>`
    }
    return super.centerContent(slots)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    MovieMasher.eventDispatcher.addDispatchListener('importer', this.handleImporter)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    MovieMasher.eventDispatcher.removeDispatchListener('importer', this.handleImporter)
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
        class='${ifDefined(importerId === id ? 'selected' : undefined)}' 
        emit='importer' detail='${id}'
      >${icon}</movie-masher-component-a>`
      
    })
  }
  override leftContent(slots: Htmls): OptionalContent {
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


  static override properties = {
    ...Div.properties,
    importerId: { type: String, attribute: 'importer-id' }
  }

  
}


// register web component as custom element
customElements.define('movie-masher-importer-div', InspectorDivElement)