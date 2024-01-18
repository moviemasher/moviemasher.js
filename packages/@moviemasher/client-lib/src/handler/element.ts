import type { ClientAsset, Timeout, } from '../types.js'
import type { ListenersFunction, Size } from '@moviemasher/shared-lib/types.js'
import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup, PropertyValues } from 'lit-element/lit-element.js'
import type { TemplateContents, OptionalContent } from '../client-types.js'
import type { DragAssetObject } from '../utility/draganddrop.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { assertDefined } from '@moviemasher/shared-lib/utility/guards.js'
import { assertSizeAboveZero } from '@moviemasher/shared-lib/utility/rect.js'
import { SELECTED, X_MOVIEMASHER } from '../runtime.js'
import { EventAssetElement, EventAssetId, EventChangeAssetId, EventChangedAssetId, EventManagedAsset, EventManagedAssetIcon } from '../utility/events.js'
import { EventAssetElementDetail } from '../types.js'
import { MOVIEMASHER, isDefiniteError, jsonStringify } from '@moviemasher/shared-lib/runtime.js'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'

export const BrowserAssetTag = 'movie-masher-browser-asset'

/**
 * @category Elements
 */
export class BrowserAssetElement extends Component {
  constructor() {
    super()
    this.listeners[EventChangedAssetId.Type] = this.handleChangedAssetId.bind(this)
  }

  private _asset?: ClientAsset | undefined
  private get asset(): ClientAsset | undefined {
    return this._asset ||= this.assetInitialize
  }

  assetId?: string

  private get assetInitialize(): ClientAsset | undefined {
    const { assetId } = this
    if (!assetId) return 

    const event = new EventManagedAsset(assetId)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    return event.detail.asset
  }

  cover?: boolean
  
  override get defaultContent(): OptionalContent { 
    const { asset, icon, labels, icons, size } = this
    const { label } = asset || this
    assertSizeAboveZero(size)

    const htmls: TemplateContents = []
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

  private _icon?: Element
  private get icon(): Element | undefined {
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

    // console.log('BrowserAssetElement.iconPromiseInitialize', {assetId, size, cover})
    const event = new EventManagedAssetIcon(assetId, size, cover)
    MOVIEMASHER.eventDispatcher.dispatch(event)
   
    const { promise } = event.detail 
    if (!promise) {        
      // console.error(this.tagName, 'iconPromiseInitialize EventManagedAssetIcon no promise')

      return Promise.resolve()
    }
    // console.log(this.tagName, 'iconPromiseInitialize EventManagedAssetIcon got promise')

    return promise.then(elementOrError => {
      if (isDefiniteError(elementOrError)) {
        // console.error(this.tagName, 'iconPromiseInitialize EventManagedAssetIcon', elementOrError.error)
        return 
      }
      
      const { data: icon } = elementOrError
      
      // console.log(this.tagName, 'iconPromiseInitialize EventManagedAssetIcon', icon?.constructor.name)

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

    MOVIEMASHER.eventDispatcher.dispatch(new EventChangeAssetId(assetId))
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
    const data: DragAssetObject = {  offset: clientX - left, assetId: id }
    dataTransfer.effectAllowed = 'copy'
    dataTransfer.setData(`${type}${X_MOVIEMASHER}`, jsonStringify(data))
  }

  private _selected = false
  private get selected(): boolean { return this._selected }
  private set selected(value: boolean) {
    if (this._selected === value) return
  
    this._selected = value
    this.classList.toggle(SELECTED, value)
  }
  
  private get selectedAssetId(): string | undefined {
    const event = new EventAssetId()
    MOVIEMASHER.eventDispatcher.dispatch(event)
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
    detail.element = BrowserAssetElement.instance(detail)
    event.stopImmediatePropagation()
  }

  static instance(detail: EventAssetElementDetail) {
    const { assetId, size, cover, label, labels, icons } = detail
    // console.log('BrowserAssetElement.instance', size, cover)
    const element = document.createElement(BrowserAssetTag)
    element.size = size
    element.label = label
    element.labels = labels
    element.icons = icons
    element.assetId = assetId
    element.cover = cover
    element.draggable = true 
    // element.tabIndex = 0
    return element
  }
  
  static override properties: PropertyDeclarations = {
    assetId: { type: String, attribute: 'asset-id' },
    label: { type: String, attribute: true },  
    size: { type: Object, attribute: false },
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

customElements.define(BrowserAssetTag, BrowserAssetElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserAssetTag]: BrowserAssetElement
  }
}

// listen for asset element event
export const ClientAssetElementListeners: ListenersFunction = () => ({
  [EventAssetElement.Type]: BrowserAssetElement.handleAssetElement
})
