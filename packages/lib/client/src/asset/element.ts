import type { ClientAsset, EventAssetElementDetail, Timeout, } from '@moviemasher/runtime-client'
import type { Size } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup, PropertyValues } from 'lit-element/lit-element.js'
import type { Contents, OptionalContent } from '../declarations.js'
import type { DragDefinitionObject } from '../utility/draganddrop.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { assertDefined, assertSizeAboveZero } from '@moviemasher/lib-shared'
import { ClassSelected, DragSuffix, EventAssetElement, EventAssetId, EventChangeAssetId, EventChangedAssetId, EventManagedAsset, EventManagedAssetIcon, MovieMasher } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../Base/Component.js'

export const SelectorAssetName = 'movie-masher-browser-asset'

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

  // protected override content(contents: Contents): Content {
  //   // console.log(this.tagName, this.assetId, 'content WTF', contents)
  //   return html`<div>${contents}</div>`
  // }
  cover?: boolean
  
  override get defaultContent(): OptionalContent { 
    const { asset, icon, labels, icons, size } = this
    const { label } = asset || this
    assertSizeAboveZero(size)

    const htmls: Contents = []
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
    const { size, cover } = this
    assertSizeAboveZero(size)
    
    const { assetId } = this
    if (!assetId) return Promise.resolve()

    const event = new EventManagedAssetIcon(assetId, size, cover)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail 
    if (!promise) return Promise.resolve()
    
    return promise.then(icon => {
      this._icon = icon
      this.requestUpdate()
    })
  }

  icons?: boolean

  label?: string 

  labels?: boolean

  override onpointerdown = (event: Event) => {
    event.stopPropagation()
    const { assetId } = this
    assertDefined(assetId)

    MovieMasher.eventDispatcher.dispatch(new EventChangeAssetId(assetId))
  }

  override ondragstart = (event: DragEvent) => {
    this.onpointerdown(event)

    const { dataTransfer, clientX } = event
    if (!dataTransfer) return 


    const { asset } = this
    if (!asset) return

    const rect = this.getBoundingClientRect()
    const { left } = rect
    
    const { id, type } = asset
    const data: DragDefinitionObject = {  offset: clientX - left, assetId: id }
    
    const json = JSON.stringify(data)
    dataTransfer.effectAllowed = 'copy'
    dataTransfer.setData(`${type}${DragSuffix}`, json)
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

  static handleAssetElement(event: EventAssetElement) {
    const { detail } = event
    detail.element = SelectorAssetElement.instance(detail)
    event.stopImmediatePropagation()
  }

  static instance(detail: EventAssetElementDetail) {
    const { assetId, size, cover, label, labels, icons } = detail
    const element = document.createElement(SelectorAssetName)
    element.size = size
    element.label = label
    element.labels = labels
    element.icons = icons
    element.assetId = assetId
    element.cover = cover
    element.draggable = true 
    return element
  }
  
  static override properties: PropertyDeclarations = {
    assetId: { type: String, attribute: 'asset-id' },
    label: { type: String, attribute: true },  
    size: { type: Object, attribute: false },
    // asset: { type: Object, attribute: false },
    // labels: { type: Boolean, attribute: false }, 
    // icons: { type: Boolean, attribute: false }, 
    
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        --pad: var(--pad-label);
        --height: var(--height-label);
        --height-text: calc(var(--height) - (2 * var(--pad)));

        cursor: grab;
        display: inline-block;
        border: var(--border);
        border-radius: var(--radius-border);
        border-color: var(--fore);
        background-color: var(--fore);
        color: var(--back);
      }
      :host > div {
        display: inline-block;
      }
      :host > label {
        color: var(--back);
        height: var(--height);
        font-size: var(--height-text);
        line-height: var(--height-text);
        padding: var(--pad);
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      :host(:hover) {
        border-color: var(--over);
        background-color: var(--over);
      }
      :host(.selected) {
        border-color: var(--on);
        background-color: var(--on);
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

// listen for asset element event
export const ClientAssetElementListeners = () => ({
  [EventAssetElement.Type]: SelectorAssetElement.handleAssetElement
})
