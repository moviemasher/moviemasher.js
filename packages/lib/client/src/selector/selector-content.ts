import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup, PropertyValueMap } from 'lit'
import type { AssetObjects, AssetType, DataOrError, Size, Source } from '@moviemasher/runtime-shared'
import type { AssetObjectFromIdEvent, AssetObjectsEventDetail, Content, Contents, ImportAssetObjectsEvent, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { isAssetType, isDefiniteError } from '@moviemasher/runtime-shared'

import { MovieMasher, EventTypeSourceType, EventTypeAssetType, EventTypeAssetObjectFromId, EventTypeImportAssetObjects, EventTypeAssetObjects, EventAssetObjectNode, EventChangedSize, EventSize, EventManagedAsset } from '@moviemasher/runtime-client'
import { ImporterComponent } from '../Base/ImporterComponent.js'
import { Scroller } from '../Base/Scroller.js'
import { SIZE_ZERO, sizeContain } from '@moviemasher/lib-shared'

export class SelectorContentElement extends Scroller {
  constructor() {
    super()
    this.listeners[EventTypeAssetType] = this.handleAssetType.bind(this)
    this.listeners[EventTypeSourceType] = this.handleSourceType.bind(this)
    this.listeners[EventTypeAssetObjectFromId] = this.handleAssetObjectFromId.bind(this)
    this.listeners[EventTypeImportAssetObjects] = this.handleImportAssetObjects.bind(this)
    this.listeners[EventChangedSize.Type] = this.handleChangedSize.bind(this)
  }

  private assetObjectsFetched: AssetObjects = []

  protected assetObjectsImported: AssetObjects = []

  private get assetObjectsCombined(): AssetObjects {
    const { assetObjectsFetched, assetObjectsImported, assetType } = this
    // TODO: use exclude* properties...

    const filtered = assetObjectsFetched.filter(assetObject => {
      const found = assetObjectsImported.some(object => object.id === assetObject.id)
      if (found) console.warn(this.tagName, 'assetObjectsCombined', 'found', assetObject)
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

  override connectedCallback(): void {
    super.connectedCallback()
    const event = new EventSize()
    MovieMasher.eventDispatcher.dispatch(event)
    const { size } = event.detail
    if (size) this.size = size
    else {
      const max = this.variable('max-dimension')
      this.size = size ? size : { width: max, height: max }
    }
  }

  protected override content(contents: Contents): Content {
    const { size: mySize = SIZE_ZERO } = this

    const max = this.variable('max-dimension')
    const size = sizeContain(mySize, max)
    console.log(this.tagName, 'content', size)
    return html`
      <div 
        class='root'
        style='width:100%;height:${size.height}px;' 
        @scroll-root='${this.handleScrollRoot}'
      >${contents}</div>
    `
  }

  protected override get defaultContent(): OptionalContent { 
    const contents: Contents= []
    const filtered = this.assetObjectsCombined
    if (filtered.length) {
      const { size } = this
      if (!size) return

      const max = this.variable('max-dimension')
      const ratio = this.variable('ratio-preview-selector')
      // const border = this.variable('border-size')

      const shortest = max * ratio
        console.log(this.tagName, 'defaultContent', { size, shortest })
      const itemSize = sizeContain(size, shortest)
  

      filtered.forEach(assetObject => {
        console.log(this.tagName, 'defaultContent', assetObject)
        MovieMasher.eventDispatcher.dispatch(new EventManagedAsset(assetObject))
        
        const event = new EventAssetObjectNode(assetObject, itemSize, true, true)
        MovieMasher.eventDispatcher.dispatch(event)
        const { node } = event.detail
        if (node) contents.push(node)
      })
    }   
    return html`<div class='content'>${contents}</div>`
  }

  private handleAssetObjectFromId(event: AssetObjectFromIdEvent) {
    const { detail } = event
    const { id } = detail
    // console.log(this.tagName, 'assetObjectHandler', id)
    detail.assetObject = this.assetObjectsCombined.find(asset => asset.id === id)
    event.stopImmediatePropagation()
  }
  
  private handleAssetType(event: CustomEvent<AssetType>): void {
    const { detail: assetType } = event
    // console.log(this.tagName, 'handleAssetType', assetType)
    this.assetType = assetType
  }

  private handleChangedSize(event: EventChangedSize) {
    this.size = event.detail
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

  size?: Size

  sourceType?: Source 

  protected override willUpdate(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has('assetType') || changedProperties.has('sourceType')) {
      this.assetObjectsPromiseRefresh()
    }
  }

  static override properties: PropertyDeclarations = {
    ...ImporterComponent.properties,
    assetType: { type: String },
    sourceType: { type: String },
    assetObjectsImported: { type: Array, attribute: false },
    size: { type: Object, attribute: false },
  }

  static override styles: CSSResultGroup = [
    Scroller.styles,
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
customElements.define('movie-masher-selector-content', SelectorContentElement)