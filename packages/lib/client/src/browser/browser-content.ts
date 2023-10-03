import type { AssetType, Assets, DataOrError, Size } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { Content, Contents, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { sizeContain } from '@moviemasher/lib-shared'
import { EventAssetElement, EventImportedManagedAssets, EventManagedAsset, EventManagedAssets, EventTypeAssetType, MovieMasher } from '@moviemasher/runtime-client'
import { SIZE_ZERO, isAssetType, isDefiniteError } from '@moviemasher/runtime-shared'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../Base/Component.js'
import { DropTargetCss, DropTargetMixin } from '../Base/DropTargetMixin.js'
import { ImporterComponent } from '../Base/ImporterComponent.js'
import { Scroller } from '../Base/Scroller.js'
import { SizeReactiveMixin, SizeReactiveProperties } from '../Base/SizeReactiveMixin.js'
import { dropRawFiles, droppingFiles } from '../utility/draganddrop.js'

const BrowserContentElementName = 'movie-masher-browser-content'

const WithSizeReactive = SizeReactiveMixin(Scroller)
const WithDropTarget = DropTargetMixin(WithSizeReactive)
export class BrowserContentElement extends WithDropTarget {
  constructor() {
    super()
    this.listeners[EventTypeAssetType] = this.handleAssetType.bind(this)
    this.listeners[EventImportedManagedAssets.Type] = this.assetsPromiseRefresh.bind(this)
  }
  override acceptsClip = false
  
  private assets: Assets = []

  private assetsPromise?: Promise<DataOrError<Assets>>
  
  private assetsPromiseRefresh(): void {
    const { assetType } = this
    if (isAssetType(assetType)) {
      const event = new EventManagedAssets({ type: assetType })
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (promise) {
        this.assetsPromise = promise
        promise.then(orError => {
          if (!isDefiniteError(orError)) {
            const { data: assetObjects } = orError
            // console.log(this.tagName, 'assetObjectsPromiseRefresh', assetObjects)
            if (assetObjects) this.assets = assetObjects
            delete this.assetsPromise
            this.requestUpdate()
          }
        })
      }
    }
  }

  assetType?: AssetType 

  protected override content(contents: Contents): Content {
    const { size = SIZE_ZERO } = this
    const max = this.variable('max-dimension')
    const containedSize = sizeContain(size, max)
    // console.log(this.tagName, 'content', containedSize)
    return html`
      <div 
        class='root'
        style='width:100%;height:${containedSize.height}px;' 
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
          MovieMasher.eventDispatcher.dispatch(event)
          const { element } = event.detail
          if (element) {
            contents.push(element)
            byId[id] = element
          }
        })
      }
      this.elementsById = byId
    }   
    return html`<div class='content'>${contents}</div>`
  }

    
  private elementsById: Record<string, Element> = {}
  

  override dropValid(dataTransfer: DataTransfer | null): boolean { 
    return droppingFiles(dataTransfer)
  }

  override handleDropped(event: DragEvent): void {
    const { dataTransfer } = event
    if (!dataTransfer) return 

    const promise = dropRawFiles(dataTransfer.files)
    if (!promise) return

    promise.then(assetObjects => {
      assetObjects.forEach(assetObject => {
        MovieMasher.eventDispatcher.dispatch(new EventManagedAsset(assetObject))
      })
    })
  }

  private handleAssetType(event: CustomEvent<AssetType>): void {
    this.assetType = event.detail
  }


  private get iconSize(): Size | undefined {
    const { size } = this
    if (!size) return
    
    const max = this.variable('max-dimension')
    const ratio = this.variable('ratio-preview-selector')
    return sizeContain(size, max * ratio)
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('size')) {
      this.elementsById = {}
    }
    if (changedProperties.has('assetType')) {
      this.assetsPromiseRefresh()
    }
  }

  static override properties: PropertyDeclarations = {
    ...ImporterComponent.properties,
    ...SizeReactiveProperties,
    assetType: { type: String, attribute: false },
    assets: { type: Array, attribute: false },
    cover: { type: Boolean },
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Scroller.styles,
    DropTargetCss,
    css`
      :host {
        --ratio-preview-selector: var(--ratio-preview, 0.25);
      }
      div.root {
        display: block;
        overflow-y: auto;
      }
      div.content {
        padding: var(--content-padding);
        font-size: 0;
      }

      div.content > * {
        margin-right: var(--content-spacing); 
        margin-bottom: var(--content-spacing);
      }

      .dropping {
        box-shadow: var(--dropping-shadow);
      }
    `
  ]
}

// register web component as custom element
customElements.define(BrowserContentElementName, BrowserContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserContentElementName]: BrowserContentElement
  }
}
