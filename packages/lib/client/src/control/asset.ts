import type { EventControlDetail, Timeout } from '@moviemasher/runtime-client'
import type { Scalar, Size } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit-element/lit-element.js'
import type { Control, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { assertDefined, assertPopulatedString, DataTypeContainerId, DataTypeContentId, sizeContain } from '@moviemasher/lib-shared'
import { EventControl, EventManagedAsset, EventManagedAssetIcon, MovieMasher } from '@moviemasher/runtime-client'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../Base/Component.js'
import { ControlMixin, ControlProperties } from '../Base/ControlMixin.js'
import { ControlPropertyMixin } from '../Base/ControlPropertyMixin.js'
import { DropTargetCss, DropTargetMixin } from '../Base/DropTargetMixin.js'
import { SizeReactiveMixin, SizeReactiveProperties } from '../Base/SizeReactiveMixin.js'
import { dragData, droppingFiles, dropRawFiles, isDragDefinitionObject } from '../utility/draganddrop.js'

const AssetControlElementName = 'movie-masher-control-asset'

const WithControlProperty = ControlPropertyMixin(Component)
const WithControl = ControlMixin(WithControlProperty)
const WithSizeReactive = SizeReactiveMixin(WithControl)
const WithDropTarget = DropTargetMixin(WithSizeReactive)
export class AssetControlElement extends WithDropTarget implements Control {
  override acceptsClip = false

  protected override get defaultContent(): OptionalContent {
    const { property, iconSize } = this
    if (!(iconSize && property)) return 

    const value = this.scalar
    const { name, options } = property
    this.setInputValue(value)
    
    if (options?.length) return this.inputSelectContent

    const { icon } = this
    // @input='${this.handleInput}'
    return html`
      <input 
        type='hidden' 
        name='${name}' 
        aria-label='${name}'
        value='${ifDefined(value)}'
      />
      <div 
        style='width:${iconSize.width}px;height:${iconSize.height}px;'
      >${icon}<div class='drop-box'></div></div>
    `
  }

  private _icon?: SVGSVGElement
  private get icon(): SVGSVGElement | undefined {
    if (!(this._icon || this._iconPromise || this.timeout)) {
      // console.debug(this.tagName, this.propertyId, 'icon', 'setting timeout')
      this.timeout = setTimeout(() => {
        delete this.timeout
        // console.debug(this.tagName, this.propertyId, 'icon', 'timeout calling iconPromise')
        this.iconPromise
      }, 10)
    } else {
      // console.debug(this.tagName, this.propertyId, 'icon', {timeout:!!this.timeout, _icon:!!this._icon, _iconPromise: !!this._iconPromise})
    }
    return this._icon
  }

  private _iconPromise?: Promise<void>

  private get iconPromise() {
    // if (this._iconPromise) console.debug(this.tagName, this.propertyId, 'iconPromise', 'returning existing promise')
    return this._iconPromise ||= this.iconPromiseInitialize
  }

  private get iconPromiseInitialize(): Promise<void> {
    const { iconSize, scalar } = this
    if (!(iconSize && scalar)) {
      // console.warn(this.tagName, this.propertyId, 'iconPromiseInitialize', 'no iconSize or selectedProperty')
      return Promise.resolve()
    }
    assertPopulatedString(scalar)

    // console.debug(this.tagName, this.propertyId, 'iconPromiseInitialize', { scalar, iconSize })
    const event = new EventManagedAssetIcon(scalar, iconSize, true)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise: iconPromise } = event.detail 
    if (!iconPromise) return Promise.resolve()
    
    return iconPromise.then(icon => {
      this._icon = icon
      // console.debug(this.tagName, this.propertyId, 'iconPromiseInitialize calling requestUpdate', { scalar, iconSize })

      this.requestUpdate()
    })
  }

  private get iconSize(): Size | undefined {
    const { size } = this
    if (!size) return
    
    const max = this.variable('max-dimension')
    const ratio = this.variable('ratio-preview-inspector')
    return sizeContain(size, max * ratio)
  }

  private iconUpdate() {
    const { icon } = this
    if (!icon) {
      console.warn(this.tagName, this.propertyId, 'iconUpdate', 'no icon')
      return
    }
    // console.debug(this.tagName, this.propertyId, 'iconUpdate', {timeout:!!this.timeout, _icon:!!this._icon, _iconPromise: !!this._iconPromise})
    delete this._icon 
    delete this._iconPromise 
    return this.icon
  }

  override dropValid(dataTransfer: DataTransfer | null): boolean { 
    const valid = super.dropValid(dataTransfer)
    if (valid && dataTransfer) {
      const { files } = dataTransfer
      const { length } = files
      if (length && length !== 1) return false
    }
    return valid
  }
  
  override handleDropped(event: DragEvent): void {
    const { dataTransfer } = event
    console.log(this.tagName, this.propertyId, 'handleDropped', !!dataTransfer)
    assertDefined(dataTransfer)

    if (droppingFiles(dataTransfer)) {
      const promise = dropRawFiles(dataTransfer.files)
      if (promise) promise.then(assetObjects => {
        const [assetObject] = assetObjects
        if (!assetObject) return

        MovieMasher.eventDispatcher.dispatch(new EventManagedAsset(assetObject))

        this.setInputValue(assetObject.id)
        console.log(this.tagName, this.propertyId, 'handleDropped', assetObject)
      })
      return 
    } 
    const data = dragData(dataTransfer)
    if (isDragDefinitionObject(data)) {
      console.log(this.tagName, this.propertyId, 'handleDropped', data)
      const { assetId } = data
      this.setInputValue(assetId)
      this.handleInput()
    }
  }
 
  
  override setInputValue(value?: Scalar): boolean {
    const changed = super.setInputValue(value)
    if (changed) {
      // console.debug(this.tagName, this.propertyId, 'setInputValue calling iconUpdate', value)
      this.iconUpdate()
    }
    return changed
  }
  
  private timeout?: Timeout

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has('selectedId')) {
      // console.debug(this.tagName, 'willUpdate selectedId', this.selectedId)
      this.iconUpdate()
    }
  }
  
  static instance(args: EventControlDetail) {
    const { propertyId } = args
    const element = document.createElement(AssetControlElementName)
    element.propertyId = propertyId
    return element
  }

  static handleNode(event: EventControl) {
    const { detail } = event
    const { type } = detail
    if (![DataTypeContainerId, DataTypeContentId].includes(type)) return
    
    detail.control = AssetControlElement.instance(detail)
    event.stopImmediatePropagation()
  }

  static override properties: PropertyDeclarations = {
    ...ControlProperties,
    ...SizeReactiveProperties,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    DropTargetCss,
    css`
      :host {
        --ratio-preview-inspector: var(--ratio-preview, 0.20);
      }
      :host > div {
        border: var(--border);
        border-radius: var(--border-radius);
        display: inline-block;
        position: relative;
      }
    `
  ]
}

// register web component as custom element
customElements.define(AssetControlElementName, AssetControlElement)

declare global {
  interface HTMLElementTagNameMap {
    [AssetControlElementName]: AssetControlElement
  }
}

// listen for control event
MovieMasher.eventDispatcher.addDispatchListener(
  EventControl.Type, AssetControlElement.handleNode
)
