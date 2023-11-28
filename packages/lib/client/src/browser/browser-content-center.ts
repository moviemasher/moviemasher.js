import type { AssetTypes, Assets, DataOrError, ManageTypes, Size, Sources } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { Content, Contents, OptionalContent } from '../Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { isAboveZero } from '@moviemasher/lib-shared/utility/guards.js'
import { sizeContain } from '@moviemasher/lib-shared/utility/rect.js'
import { AssetObjectsParams, ClipLocation, EventAssetElement, EventBrowserPick, EventBrowserPicked, EventChangedManagedAssets, EventManagedAssets, MOVIEMASHER, StringEvent, isManageType } from '@moviemasher/runtime-client'
import { DASH, SIZE_ZERO, arrayFromOneOrMore, isAssetType, isDefiniteError } from '@moviemasher/runtime-shared'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'
import { DROP_TARGET_CSS, DropTargetMixin } from '../mixins/component.js'
import { ImporterComponent } from '../base/Component.js'
import { Scroller } from '../base/LeftCenterRight.js'
import { SizeReactiveMixin, SIZE_REACTIVE_DECLARATIONS } from '../mixins/component.js'
import { droppingFiles } from '../utility/draganddrop.js'

const BrowserContentCenterTag = 'movie-masher-browser-content-center'

const WithSizeReactive = SizeReactiveMixin(Scroller)
const WithDropTarget = DropTargetMixin(WithSizeReactive)
/**
 * @category Component
 */
export class BrowserContentCenterElement extends WithDropTarget {
  constructor() {
    super()
    this.listeners[EventBrowserPick.Type] = this.handleBrowserPick.bind(this)
    this.listeners[EventChangedManagedAssets.Type] = this.handleChangedManagedAssets.bind(this)
  }
  override acceptsClip = false
  
  private assets: Assets = []

  private assetsPromise?: Promise<DataOrError<Assets>>
  
  private assetsPromiseRefresh(): void {
    const { types, sources, manageTypes, sort } = this
    const sorts = arrayFromOneOrMore(sort || [])
    // console.log(this.tagName, 'assetsPromiseRefresh', types, sources)
    if (isAboveZero(types.length + sources.length)) {
      const params: AssetObjectsParams = { manageTypes, sorts, sources, types }
      const event = new EventManagedAssets(params)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (promise) {
        this.assetsPromise = promise
        promise.then(orError => {
          if (!isDefiniteError(orError)) {
            const { data: assets } = orError
            // console.log(this.tagName, 'assetObjectsPromiseRefresh', assets.length)
            this.assets = assets
            delete this.assetsPromise
            this.requestUpdate()
          }
        })
      }
    }
  }

  private types: AssetTypes = []

  override connectedCallback(): void {
    super.connectedCallback()
    const event = new EventBrowserPicked()
    MOVIEMASHER.eventDispatcher.dispatch(event)
    this.pick(event.detail.picked)

  }
  protected override content(contents: Contents): Content {
    const { size = SIZE_ZERO } = this
    const max = this.variable('size-preview')
    const contained = sizeContain(size, max)
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
    const contents: Contents = []
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
          MOVIEMASHER.eventDispatcher.dispatch(event)
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

  private handleBrowserPick(event: StringEvent): void {
    this.pick(event.detail)
  }

  private handleChangedManagedAssets(_: EventChangedManagedAssets): void {
    // const { detail } = event
    
    this.assetsPromiseRefresh()
  }

  private get iconSize(): Size | undefined {
    const { size } = this
    if (!size) return
    
    const max = this.variable('size-preview')
    const ratio = this.variable('ratio-preview-selector')
    return sizeContain(size, max * ratio)
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
    const assetTypes: AssetTypes = []
    const manageTypes: ManageTypes = []

    components.forEach(component => {
      if (isAssetType(component)) assetTypes.push(component)
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
    ...ImporterComponent.properties,
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
