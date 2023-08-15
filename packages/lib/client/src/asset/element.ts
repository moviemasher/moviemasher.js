import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup, PropertyValues } from 'lit-element/lit-element.js'
import type { ClientAsset, EventAssetObjectNodeDetail, Timeout, } from '@moviemasher/runtime-client'
import type { Size } from '@moviemasher/runtime-shared'
import type { Content, Contents, OptionalContent } from '../declarations.js'
import type { DragDefinitionObject } from '../utility/draganddrop.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'

import { ClassSelected, DragSuffix, EventAssetId, EventAssetObjectNode, EventChangeAssetId, EventChangedAssetId, EventManagedAsset, EventManagedAssetIcon, MovieMasher } from '@moviemasher/runtime-client'
import { assertDefined, assertSizeAboveZero } from '@moviemasher/lib-shared'

import { Component } from '../Base/Component.js'

export const SelectorAssetName = 'movie-masher-selector-asset'

export class SelectorAssetElement extends Component {
  constructor() {
    super()
    this.listeners[EventChangedAssetId.Type] = this.handleChangedAssetId.bind(this)
  }

  private _asset?: ClientAsset | undefined

  private get asset(): ClientAsset | undefined {
    return this._asset ||= this.assetInitialize
  }

  private get assetInitialize(): ClientAsset | undefined {
    const { assetId } = this
    if (!assetId) return 

    const event = new EventManagedAsset(assetId)
    MovieMasher.eventDispatcher.dispatch(event)
    return event.detail.asset
  }

  assetId?: string

  protected override content(contents: Contents): Content {
    // console.log(this.tagName, this.assetId, 'content WTF', contents)
    return html`<div>${contents}</div>`
  }

  override get defaultContent(): OptionalContent { 
    const { asset } = this
    if (!asset) return 

    // console.log(this.tagName, this.assetId, 'defaultContent', asset)

    const { icon, labels, icons } = this
    const htmls: Contents = []
    const { label } = asset
//  
    const { size } = this
    assertSizeAboveZero(size)

    if (labels) {
      htmls.push(html`<label style='width:${size.width}px;'>${label}</label>`)
    }
    if (icons) {  
      if (icon) htmls.push(icon)
      else htmls.push(html`<div style='width:${size.width}px;height:${size.height}px;'></div>`)
    }
    return html`${htmls}`
  }

  private handleChangedAssetId(event: EventChangedAssetId) {
    this.selected = event.detail === this.assetId
  }

  private _icon?: SVGSVGElement
  private get icon(): SVGSVGElement | undefined {
    if (!(this._icon || this._iconPromise || this.timeout)) {
      this.timeout = setTimeout(() => {
        delete this.timeout
        this.iconPromise
      }, 10)
    }
    return this._icon
  }

  private _iconPromise?: Promise<void>

  private get iconPromise() {
    return this._iconPromise ||= this.iconPromiseInitialize
  }

  private get iconPromiseInitialize(): Promise<void> {
    const { size } = this
    assertSizeAboveZero(size)
    
    const { assetId } = this
    if (!assetId) return Promise.resolve()

    const event = new EventManagedAssetIcon(assetId, size)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail 
    if (!promise) return Promise.resolve()
    
    return promise.then(icon => {
      this._icon = icon
      this.requestUpdate()
    })
  }

  icons?: boolean

  labels?: boolean

  override onpointerdown = (event: Event) => {
    event.stopPropagation()
    const { assetId } = this
    assertDefined(assetId)

    // console.log(this.tagName, 'onpointerdown', assetId)
    MovieMasher.eventDispatcher.dispatch(new EventChangeAssetId(assetId))
  }

  override ondragstart = (event: DragEvent) => {
    this.onpointerdown(event)

    const { asset } = this
    if (!asset) return

    const { type } = asset
    const rect = this.getBoundingClientRect()
    const { left } = rect
    const { clientX } = event
    // const mediaObject = media.toJSON()
    const data: DragDefinitionObject = { 
      offset: clientX - left, assetId: asset.id
    }
    const json = JSON.stringify(data)
    // console.log('DefinitionItem.onDragStart', json)
    const { dataTransfer } = event
    if (!dataTransfer) return 
    
    dataTransfer.effectAllowed = 'copy'
    dataTransfer.setData(type + DragSuffix, json)

    // MovieMasher.eventDispatcher.dispatch(new EventChangeDragging(true))
  }

  private _selected = false
  private get selected(): boolean { return this._selected }
  private set selected(value: boolean) {
    if (this._selected === value) return
  
    this._selected = value
    this.classList.toggle(ClassSelected, value)
  }
  
  private get selectedAssetId(): string | undefined {
    const event = new EventAssetId()
    MovieMasher.eventDispatcher.dispatch(event)
    return event.detail.assetId
  }

  size?: Size

  private timeout?: Timeout

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('assetId') && this.assetId) {
      delete this._asset
      delete this._icon
      delete this._iconPromise
      this.selected = this.assetId === this.selectedAssetId
    }
  }

  static handleNode(event: EventAssetObjectNode) {
    const { detail } = event
    detail.element = SelectorAssetElement.instance(detail)
    event.stopImmediatePropagation()
  }

  static instance(detail: EventAssetObjectNodeDetail) {
    const { assetId, size, labels, icons } = detail
    const element = document.createElement(SelectorAssetName)
    element.size = size
    element.labels = labels
    element.icons = icons
    element.assetId = assetId
    element.draggable = true 
    return element
  }
  
  static override properties: PropertyDeclarations = {
    assetId: { type: String, attribute: 'asset-id', reflect: false },
    size: { type: Object, attribute: false },
    labels: { type: Boolean, attribute: false }, 
    icons: { type: Boolean, attribute: false }, 
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        display: inline-block;
      }

      :host > div {
        display: inline-block;
        border: var(--border);
        border-radius: var(--border-radius);
        border-color: var(--item-fore);
        color: var(--item-fore);
        background-color: var(--item-back);
      }
      :host div > label {
        font-size: initial;
        --padding: 2px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: var(--padding);
      }
      :host > div:hover,
      :host(div.selected) {
        border-color: var(--item-fore-selected);
        color: var(--item-fore-selected);
        background-color: var(--item-back-selected);
      }

      :host > div.selected:hover {
        border-color: var(--item-back-hover);
        color: var(--item-back-hover);
        background-color: var(--item-fore-hover);
      }  
    `
  ]
}

// register web component as custom element
customElements.define(SelectorAssetName, SelectorAssetElement)

declare global {
  interface HTMLElementTagNameMap {
    [SelectorAssetName]: SelectorAssetElement
  }
}

// listen for asset object node event
MovieMasher.eventDispatcher.addDispatchListener(EventAssetObjectNode.Type, SelectorAssetElement.handleNode)