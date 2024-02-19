import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { Htmls, OptionalContent } from '../client-types.js'
import type { AssetObjects, RawTypes, Nodes, Sources } from '@moviemasher/shared-lib/types.js'
import type { NodeFunction } from '../types.js'

import { ICON, assertDatasetElement } from '../runtime.js'
import { EventDialog, EventImporterNodeFunction, EventImportManagedAssets, EventImporterAdd, EventImporterComplete, EventImporterRemove, EventPick, EventPicked, StringEvent } from '../utility/events.js'
import { html, nothing } from 'lit-html'
import { CENTER, ContentBase } from '../base/LeftCenterRight.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { MOVIEMASHER, DASH, $IMPORTER, isRawType } from '@moviemasher/shared-lib/runtime.js'
import { assertPositive } from '@moviemasher/shared-lib/utility/guards.js'
import { isPositive } from '@moviemasher/shared-lib/utility/guard.js'

const EventTypeImporter = 'importer'

export const ImporterContentTag = 'movie-masher-importer-content'

/**
 * @category Elements
 */
export class ImporterContentElement extends ContentBase {
  protected assetObjects: AssetObjects = []

  protected override centerContent(slots: Htmls): OptionalContent {
    const { selectedUi } = this
    if (!selectedUi) super.centerContent(slots)
    
    return html`<span 
      @export-parts='${this.handleExportParts}' 
      class='${CENTER}'
      part='${CENTER}'
    >${selectedUi}</span>`
  }

  override connectedCallback(): void {
    this.listeners[EventTypeImporter] = this.handleImporter.bind(this)
    this.listeners[EventImporterAdd.Type] = this.handleImporterAdd.bind(this)
    this.listeners[EventImporterRemove.Type] = this.handleImporterRemove.bind(this)
    this.listeners[EventImporterComplete.Type] = this.handleImporterComplete.bind(this)
    this.listeners[EventPick.Type] = this.handlePick.bind(this)
    const event = new EventPicked($IMPORTER)
    MOVIEMASHER.dispatch(event)
    this.pick(event.detail.picked)
    super.connectedCallback()
  }

  private uis: NodeFunction[] = []

  private handleImporter(event: StringEvent): void {
    const { detail } = event
    const index = Number(detail)
    assertPositive(index)
    
    this.selected = index
  }

  private handleImporterComplete(): void {
    MOVIEMASHER.dispatch(new EventDialog())

    const { assetObjects } = this
    this.assetObjects = []
    MOVIEMASHER.dispatch(new EventImportManagedAssets(assetObjects))
  }

  private handleImporterAdd(event: EventImporterAdd): void {
    const { assetObject } = event.detail
    // console.log('handleImporterAdd', assetObject)
    if (assetObject) this.assetObjects = [...this.assetObjects, assetObject]
  }

  private handleImporterRemove(event: EventImporterRemove): void {
    event.stopImmediatePropagation()
    const { detail: id } = event
    this.assetObjects = this.assetObjects.filter(assetObject => assetObject.id !== id)
  }

  private handlePick(event: EventPick): void {
    const { picker } = event.detail
    if (picker !== $IMPORTER) return

    this.pick(event.detail.picked)
  }

  private _iconHtmls?: Htmls
  private get iconHtmls(): Htmls {
    const { selected } = this
    return this._iconHtmls ||= this.icons.map((node, index) => {
      const icon: Node = node.cloneNode(true)
      assertDatasetElement(icon)

      icon.setAttribute('slot', ICON)
      return html`<movie-masher-link 
        selected='${(selected === index) || nothing}' 
        emit='${EventTypeImporter}' detail='${index}'
      >${icon}</movie-masher-link>`
    })
  }

  icons: Nodes = []

  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    const { iconHtmls } = this
    const { length } = iconHtmls
    if (length) {
      this.loadComponent('movie-masher-link')
      htmls.push(...iconHtmls)
    }
    return super.leftContent(htmls)
  }

  private pick(detail = '') {
    const components = detail.split(DASH).map(component => component.trim())
    const sources: Sources = []
    const types: RawTypes = []
    components.forEach(component => {
      if (isRawType(component)) types.push(component)
      else sources.push(component)
    })
    // console.log(this.tagName, 'pick', sources, types)
    const event = new EventImporterNodeFunction(types, sources)
    MOVIEMASHER.dispatch(event)
    const { map } = event.detail
    const icons = [...map.keys()]
    const uis = [...map.values()]
    const { selectedIcon } = this
    const index = icons.findIndex(node => node === selectedIcon)
    this.uis = uis
    this.icons = icons
    this.selected = (index < 0 && icons.length) ? 0 : index
  }

  protected override rightContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    const { assetObjects } = this
    this.loadComponent('movie-masher-link')
    
    this.loadComponent('movie-masher-icon')

    htmls.push(...assetObjects.map(assetObject => {
      return html`<movie-masher-link
          icon='remove-circle'
          emit='${EventImporterRemove.Type}'
          detail='${assetObject.id}'
        ></movie-masher-link>
        <span>${assetObject.label}</span>
        <movie-masher-icon
          icon='${assetObject.type}'
        ></movie-masher-icon>`
    }))
    return super.rightContent(htmls)
  }

  private get selectedIcon(): Node | undefined {
    const { selected, icons } = this
    return isPositive(selected) ? icons[selected] : undefined
  }

  private get selectedUi(): Node | undefined {
    const { selected, uis } = this
    return isPositive(selected) ? uis[selected]() : undefined
  }

  selected = -1

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    // console.log(this.tagName, 'willUpdate', changedProperties)
    if (changedProperties.has('selected') || changedProperties.has('icons')) {
      delete this._iconHtmls
    }
    super.willUpdate(changedProperties)
  }

  static override properties: PropertyDeclarations = {
    ...ContentBase.properties,
    assetObjects: { type: Array, attribute: false },
    selected: { type: Number },
    icons: { type: Array, attribute: false },
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

customElements.define(ImporterContentTag, ImporterContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [ImporterContentTag]: ImporterContentElement
  }
}
