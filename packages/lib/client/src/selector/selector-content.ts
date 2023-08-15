import type { AssetObjects, AssetType, DataOrError, Size, Source } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { AssetObjectsEventDetail, Content, Contents, OptionalContent } from '../declarations.js'
import type {  } from '@moviemasher/runtime-client'

import { css } from '@lit/reactive-element/css-tag.js'
import { sizeContain } from '@moviemasher/lib-shared'
import { EventAssetObjectNode, EventManagedAsset, EventTypeAssetObjects, EventTypeAssetType, ImportAssetObjectsEvent, EventTypeSourceType, MovieMasher } from '@moviemasher/runtime-client'
import { SIZE_ZERO, isAssetType, isDefiniteError } from '@moviemasher/runtime-shared'
import { html } from 'lit-html/lit-html.js'
import { ImporterComponent } from '../Base/ImporterComponent.js'
import { Scroller } from '../Base/Scroller.js'
import { SizeReactiveMixin, SizeReactiveProperties } from '../Base/SizeReactiveMixin.js'
import { DropTargetCss, DropTargetMixin } from '../Base/DropTargetMixin.js'
import { Component } from '../Base/Component.js'
import {  dropRawFiles, droppingFiles } from '../utility/draganddrop.js'

const SelectorContentElementName = 'movie-masher-selector-content'


const WithSizeReactive = SizeReactiveMixin(Scroller)
const WithDropTarget = DropTargetMixin(WithSizeReactive)
export class SelectorContentElement extends WithDropTarget {
  constructor() {
    super()
    this.listeners[EventTypeAssetType] = this.handleAssetType.bind(this)
    this.listeners[EventTypeSourceType] = this.handleSourceType.bind(this)
    this.listeners[ImportAssetObjectsEvent.Type] = this.handleImportAssetObjects.bind(this)
  }
  override acceptsClip = false
  
  private assetObjectsFetched: AssetObjects = []

  protected assetObjectsImported: AssetObjects = []

  private get assetObjectsCombined(): AssetObjects {
    const { assetObjectsFetched, assetObjectsImported, assetType } = this
    // TODO: use exclude* properties...

    const filtered = assetObjectsFetched.filter(assetObject => {
      const found = assetObjectsImported.some(object => object.id === assetObject.id)
      // if (found) console.warn(this.tagName, 'assetObjectsCombined', 'found', assetObject)
      return !found
    })
    const combined = [...assetObjectsImported, ...filtered]

    return combined.filter(mediaObject => {
      const { type } = mediaObject
      return assetType === type
    })
  }

  private assetObjectsPromise?: Promise<DataOrError<AssetObjects>>
  
  private assetObjectsPromiseRefresh(): void {
    const { assetType } = this
    if (isAssetType(assetType)) {
      const detail: AssetObjectsEventDetail = {
        type: assetType
      }
      const event = new CustomEvent(EventTypeAssetObjects, { detail })
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = detail
      if (promise) {
        this.assetObjectsPromise = promise
        promise.then(orError => {
          if (!isDefiniteError(orError)) {
            const { data: assetObjects } = orError
            // console.log(this.tagName, 'assetObjectsPromiseRefresh', assetObjects)
            if (assetObjects) this.assetObjectsFetched = assetObjects
            delete this.assetObjectsPromise
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

  protected override get defaultContent(): OptionalContent { 
    const contents: Contents = []
    const { assetObjectsCombined } = this
    if (assetObjectsCombined.length) {
      const byId: Record<string, Element> = {}

      const { elementsById } = this
      const labels = true
      const icons = true
      const { iconSize } = this
      if (iconSize) {
        assetObjectsCombined.forEach(assetObject => {
          const { id } = assetObject
          const existing = elementsById[id]
          if (existing) {
            contents.push(existing)
            byId[id] = existing
            return 
          }
          MovieMasher.eventDispatcher.dispatch(new EventManagedAsset(assetObject))
          const event = new EventAssetObjectNode(id, iconSize, icons, labels)
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

  private handleImportAssetObjects(event: ImportAssetObjectsEvent) {
    const { detail } = event
    const { assetObjects } = detail
    console.debug(this.tagName, 'handleImportAssetObjects', assetObjects)
    const { assetObjectsImported } = this
    const filtered = assetObjectsImported.filter(assetObject => {
      const found = assetObjects.some(object => object.id === assetObject.id)
      if (found) console.warn(this.tagName, 'handleImportAssetObjects REIMPORT', assetObject)
      return !found
    })
    
    this.assetObjectsImported = [...filtered, ...assetObjects]
  }
  
  private handleSourceType(event: CustomEvent<Source>): void {
    const { detail: sourceType } = event
    // console.log(this.tagName, 'handleSourceType', sourceType)
    this.sourceType = sourceType
  }


  private get iconSize(): Size | undefined {
    const { size } = this
    if (!size) return
    
    const max = this.variable('max-dimension')
    const ratio = this.variable('ratio-preview-selector')
    return sizeContain(size, max * ratio)
  }
  
  sourceType?: Source 

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('size')) {
      this.elementsById = {}
    }
    if (changedProperties.has('assetType') || changedProperties.has('sourceType')) {
      this.assetObjectsPromiseRefresh()
    }
  }

  static override properties: PropertyDeclarations = {
    ...ImporterComponent.properties,
    ...SizeReactiveProperties,
    assetType: { type: String },
    sourceType: { type: String },
    assetObjectsImported: { type: Array, attribute: false },
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
customElements.define(SelectorContentElementName, SelectorContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [SelectorContentElementName]: SelectorContentElement
  }
}
