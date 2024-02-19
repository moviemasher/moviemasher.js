import type { RawTypes, Assets, DataOrError, ManageTypes, Size, Sources } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { OptionalContent, TemplateContent, TemplateContents } from '../client-types.js'
import type { ClipLocation } from '../types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { $BROWSER, DASH, MOVIEMASHER, SIZE_ZERO, arrayFromOneOrMore, arrayRemove, isRawType, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { isAboveZero } from '@moviemasher/shared-lib/utility/guard.js'
import { containSize } from '@moviemasher/shared-lib/utility/rect.js'
import { html } from 'lit-html'
import { Component, ComponentLoader } from '../base/Component.js'
import { Scroller } from '../base/LeftCenterRight.js'
import { DROP_TARGET_CSS, DisablableMixin, DropTargetMixin, SIZE_REACTIVE_DECLARATIONS, SizeReactiveMixin } from '../mixin/component.js'
import { isManageType } from '../runtime.js'
import { EventAssetElement, EventPick, EventPicked, EventChangedManagedAssets, EventManagedAssets, EventWillDestroy, EventCanDestroy } from '../utility/events.js'
import { AssetObjectsParams } from '../types.js'
import { droppingFiles } from '../utility/draganddrop.js'

export const BrowserContentCenterTag = 'movie-masher-browser-content-center'
const WithDisablable = DisablableMixin(Scroller)
const WithSizeReactive = SizeReactiveMixin(WithDisablable)
const WithDropTarget = DropTargetMixin(WithSizeReactive)
/**
 * @category Elements
 */
export class BrowserContentCenterElement extends WithDropTarget {
  override acceptsClip = false
  
  private assets: Assets = []

  private assetsPromise?: Promise<DataOrError<Assets>>
  
  private assetsPromiseRefresh(): void {
    const { types, sources, manageTypes, sort, disabled } = this
    if (disabled) return  
    
    const sorts = arrayFromOneOrMore(sort || [])
    // console.log(this.tagName, 'assetsPromiseRefresh', types, sources)
    if (isAboveZero(types.length + sources.length)) {
      const params: AssetObjectsParams = { manageTypes, sorts, sources, types }
      const event = new EventManagedAssets(params)
      MOVIEMASHER.dispatch(event)
      const { promise } = event.detail
      if (promise) {
        this.assetsPromise = promise
        promise.then(orError => {
          delete this.assetsPromise  
          if (!isDefiniteError(orError)) {
            const { data } = orError
            const assetIds = this.assets.map(asset => asset.id)
            this.assets = data          
            MOVIEMASHER.dispatch(new EventCanDestroy(assetIds))
            this.requestUpdate()
          }
        })
      }
    }
  }

  private types: RawTypes = []

  override connectedCallback(): void {
    this.listeners[EventPick.Type] = this.handlePick.bind(this)
    this.listeners[EventPick.Type] = this.handlePick.bind(this)
    this.listeners[EventWillDestroy.Type] = this.handleWillDestroy.bind(this)
    this.listeners[EventChangedManagedAssets.Type] = this.handleChangedManagedAssets.bind(this)
    const event = new EventPicked($BROWSER)
    MOVIEMASHER.dispatch(event)
    this.pick(event.detail.picked)
    super.connectedCallback()
  }

  protected override templateContent(contents: TemplateContents): TemplateContent {
    const { size = SIZE_ZERO } = this
    const max = this.variable('size-preview')
    const contained = containSize(size, max)
    // console.log(this.tagName, 'content', { contained, size, max })
    return html`
      <div 
        class='root'
        style='width:100%;height:${contained.height}px;' 
        @scroll-root='${this.handleScrollRoot}'
      >${contents}<div class='drop-box'></div></div>
    `
  }

  cover?: boolean

  protected override get defaultContent(): OptionalContent { 
    const contents: TemplateContents = []
    const { assets } = this
    if (assets.length) {
      const byId: Record<string, Element> = {}

      const { elementsById } = this
      const labels = true
      const icons = true
      const { iconSize, cover } = this
      if (iconSize) {
        assets.forEach(assetObject => {
          const { id, label } = assetObject
          const existing = elementsById[id]
          if (existing) {
            contents.push(existing)
            byId[id] = existing
            return 
          }

          const event = new EventAssetElement(id, iconSize, cover, label, icons, labels)
          MOVIEMASHER.dispatch(event)
          const { element } = event.detail
          if (element) {
            contents.push(element)
            byId[id] = element
          }
        })
      }
      this.elementsById = byId
    }   
    return html`<div class='contents'>${contents}</div>`
  }

  private elementsById: Record<string, Element> = {}
  

  override dropValid(dataTransfer: DataTransfer | null): boolean { 
    return droppingFiles(dataTransfer)
  }

  private handlePick(event: EventPick): void {
    const { picker } = event.detail
    if (picker !== $BROWSER) return

    this.pick(event.detail.picked)
  }

  private handleChangedManagedAssets(_: EventChangedManagedAssets): void {
    this.assetsPromiseRefresh()
  }

  private handleWillDestroy(event: EventWillDestroy) {
    const { detail: ids } = event
    const assetIds = this.assets.map(asset => asset.id)
    arrayRemove(ids, assetIds)
  }
  

  private get iconSize(): Size | undefined {
    const { size } = this
    if (!size) return
    
    const max = this.variable('size-preview')
    const ratio = this.variable('ratio-preview-selector')
    return containSize(size, max * ratio)
  }

  private manageTypes: ManageTypes = []

  override mashIndex(_: DragEvent): ClipLocation | undefined {
    return 
  }

  sort?: string = 'created-asc'

  private pick(detail?: string) {
    if (!detail) {
      this.assets = []
      return
    }

    const components = detail.split(DASH).map(component => component.trim())
    const sources: Sources = []
    const assetTypes: RawTypes = []
    const manageTypes: ManageTypes = []

    components.forEach(component => {
      if (isRawType(component)) assetTypes.push(component)
      else if (isManageType(component)) manageTypes.push(component)
      else sources.push(component)
    })
    this.types = assetTypes
    this.sources = sources
    this.manageTypes = manageTypes
    this.assetsPromiseRefresh()
  }

  private sources: Sources = []
  
  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('size')) {
      this.elementsById = {}
    } 
  }

  static override properties: PropertyDeclarations = {
    ...ComponentLoader.properties,
    ...SIZE_REACTIVE_DECLARATIONS,
    assets: { type: Array, attribute: false },
    cover: { type: Boolean },
    sort: { type: String },
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Scroller.styles,
    DROP_TARGET_CSS,
    css`
      :host {
        --ratio-preview-selector: var(--ratio-preview, 0.25);
        --gap: var(--gap-content);
      }
      div.root {
        display: block;
        overflow-y: auto;
      }

      div.contents {
        padding: var(--pad);
        font-size: 0;
      }

      div.contents > * {
        margin-right: var(--gap); 
        margin-bottom: var(--gap);
      }

      .dropping {
        box-shadow: var(--dropping-shadow);
      }
    `
  ]
}

customElements.define(BrowserContentCenterTag, BrowserContentCenterElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserContentCenterTag]: BrowserContentCenterElement
  }
}
