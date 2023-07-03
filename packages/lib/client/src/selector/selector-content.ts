import type { CSSResultGroup, PropertyValueMap } from 'lit'
import type { AssetObjects, AssetType, DataOrError, Source } from '@moviemasher/runtime-shared'
import type { AssetObjectFromIdEvent, AssetObjectsEventDetail, Content, Htmls, ImportAssetObjectsEvent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { isAssetType, isDefiniteError } from '@moviemasher/runtime-shared'

import { MovieMasher, EventTypeSourceType, EventTypeAssetType, EventTypeAssetObjectFromId, EventTypeImportAssetObjects, EventTypeAssetObjects } from '@moviemasher/runtime-client'
import { ImporterComponent } from '../Base/ImporterComponent.js'

export class SelectorContentElement extends ImporterComponent {
  constructor() {
    super()
    this.listeners[EventTypeAssetType] = this.handleAssetType.bind(this)
    this.listeners[EventTypeSourceType] = this.handleSourceType.bind(this)
    this.listeners[EventTypeAssetObjectFromId] = this.handleAssetObjectFromId.bind(this)
    this.listeners[EventTypeImportAssetObjects] = this.handleImportAssetObjects.bind(this)
  }

  private assetObjectsFetched: AssetObjects = []

  protected assetObjectsImported: AssetObjects = []

  private get assetObjectsCombined(): AssetObjects {
    const { assetObjectsFetched, assetObjectsImported, assetType } = this
    // TODO: use exclude* properties...

    const combined = [...assetObjectsImported, ...assetObjectsFetched]
    const filtered = combined.filter(mediaObject => {
      const { type } = mediaObject
      return assetType === type
    })
    return filtered
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

  protected override get defaultContent(): Content | void { 
    const htmls: Htmls= []
    const filtered = this.assetObjectsCombined
    if (filtered.length) {
      this.importTags('movie-masher-selector-span')
      htmls.push(...filtered.map(assetObject => {
        const { id } = assetObject
        // console.log(this.tagName, 'centerContent', id)
        return html`<movie-masher-selector-span 
          asset-id='${id}'
        ></movie-masher-selector-span>`
      }))
    }   
    return html`${htmls}`
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

  private handleImportAssetObjects(event: ImportAssetObjectsEvent) {
    const { detail } = event
    const { assetObjects } = detail
    this.assetObjectsImported = [...this.assetObjectsImported, ...assetObjects]
  }
  
  private handleSourceType(event: CustomEvent<Source>): void {
    const { detail: sourceType } = event
    // console.log(this.tagName, 'handleSourceType', sourceType)
    this.sourceType = sourceType
  }

  sourceType?: Source 

  protected override willUpdate(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has('assetType') || changedProperties.has('sourceType')) {
      this.assetObjectsPromiseRefresh()
    }
  }

  static override properties = {
    ...ImporterComponent.properties,
    assetType: { type: String },
    sourceType: { type: String },
    assetObjectsImported: { type: Array, attribute: false },
  }

  static override styles: CSSResultGroup = [
    css`
      :host {
        flex-grow: 1;
        display: grid;
        overflow-y: auto;

        padding: var(--content-padding);
        gap: var(--content-spacing);

        grid-template-columns: repeat(auto-fit, calc(var(--viewer-width) * var(--icon-ratio)));
        grid-auto-rows: calc(var(--viewer-height) * var(--icon-ratio));
      }
  
      :host.dropping {
        box-shadow: var(--dropping-shadow);
      }

      movie-masher-selector-span:hover,
      movie-masher-selector-span.selected {
        border-color: var(--item-fore-selected);
        color: var(--item-fore-selected);
        background-color: var(--item-back-selected);
      }

      movie-masher-selector-span.selected:hover {
        border-color: var(--item-fore-hover);
        color: var(--item-fore-hover);
        background-color: var(--item-back-hover);
      }  

    `
  ]
}

// register web component as custom element
customElements.define('movie-masher-selector-content', SelectorContentElement)