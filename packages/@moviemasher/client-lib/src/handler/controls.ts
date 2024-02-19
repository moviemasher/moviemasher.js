import type { ControlInput, ControlProperty, SelectedProperties, SelectedProperty, Timeout } from '../types.js'
import type { BooleanRecord, Constrained, DataType, ListenersFunction, Property, PropertyId, PropertyIds, Scalar, Size, Strings, TargetId } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit-element/lit-element.js'
import type { TemplateContents, Control, ControlGroup, OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { assertDefined, assertPopulatedString, isPropertyId } from '@moviemasher/shared-lib/utility/guards.js'
import { containSize } from '@moviemasher/shared-lib/utility/rect.js'
import { $LOCK, $OPACITY, $SIZE, MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventManagedAssetPromise, EventAssetId, EventChangeFrame, EventChangeScalar, EventEdited, EventChangedAssetId, EventChangedClipId, EventChangedMashAsset, EventClipId, EventControl, EventControlGroup, EventManagedAssetIcon, EventMashAsset, EventScalar, EventSelectedProperties, EventTimeRange, StringEvent, EventRequestUpdate } from '../utility/events.js'
import { $ASPECT, $ASSET, $BOOLEAN, $BOTTOM, $CLIP, $CONTAINER, $CONTAINER_ID, $CONTENT_ID, $CROP, DIRECTIONS_SIDE, DOT, $END, $FLIP, $FRAME, $HEIGHT, $LEFT, $MASH, $NUMBER, $PERCENT, POINT_KEYS, $RGB, $RIGHT, SIZE_KEYS, $STRING, $TOP, $WIDTH, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { html, nothing } from 'lit-html'
import { Component, ComponentLoader } from '../base/Component.js'
import { isTargetId } from '../guards/TypeGuards.js'
import { DROP_TARGET_CSS, DropTargetMixin, SIZE_REACTIVE_DECLARATIONS, SizeReactiveMixin } from '../mixin/component.js'
import { dragData, dropRawFiles, droppingFiles, isDragAssetObject } from '../utility/draganddrop.js'
import { EventControlDetail } from '../types.js'
import { isClientAsset } from '../runtime.js'
import { isDefined } from '@moviemasher/shared-lib/utility/guard.js'

export function ControlGroupMixin
<T extends Constrained<ComponentLoader>>(Base: T): 
T & Constrained<ControlGroup> {
  return class extends Base implements ControlGroup {
    constructor(...args: any[]) {
      super(...args)
      this.listeners[EventEdited.Type] = this.handleChanged.bind(this)
    }

    addOrRemoveEnd(addOrRemove: string, propertyNamePrefix: string): void {
      const value = addOrRemove ==='remove' ? undefined : this.currentValue(propertyNamePrefix)
      const endName = `${propertyNamePrefix}${$END}`
      const endPropertyId = this.namePropertyId(endName)
      if (!endPropertyId) {
        // console.warn(this.tagName, 'addOrRemoveEnd', { endPropertyId, addOrRemove, value })
        return
      }
      // console.log(this.tagName, 'addOrRemoveEnd', endPropertyId)
      MOVIEMASHER.dispatch(new EventChangeScalar(endPropertyId, value))
    }

    controlContent(name: string, icon?: string, more?: OptionalContent): OptionalContent {
      const id = this.namePropertyId(name)
      if (!id) return

      const iconName = icon || name

      this.loadComponent('movie-masher-icon')
      return html`
        <div>
          <movie-masher-icon icon='${iconName}'></movie-masher-icon>
          ${this.controlInputContent(id)}
          ${this.controlInputContentEnd(name)}
          ${more}
        </div>
      `
    }

    controlInputContent(propertyId?: PropertyId, dataType?: DataType): OptionalContent {
      if (!propertyId) return

      return html`
        <movie-masher-control-input 
          property-id='${propertyId}' data-type='${dataType || nothing}'
        ></movie-masher-control-input>
      `
    }

    controlInputContentEnd(namePrefix: string): OptionalContent {
      const { propertyIds } = this
      const endName = `${namePrefix}${$END}`
      const endPropertyId = propertyIds?.find(id => id.endsWith(`${DOT}${endName}`))
      if (!endPropertyId) return

      const [target] = endPropertyId.split(DOT)
  
      this.loadComponent('movie-masher-link')
      const event = new EventScalar(endPropertyId)
      MOVIEMASHER.dispatch(event)
      const defined = isDefined(event.detail.value)
      const addOrRemove = defined ? 'remove' : 'add'
      const input = defined ? this.controlInputContent(endPropertyId): undefined
      return html`
        ${input}
        <movie-masher-link
          emit='control-group-${target}-${namePrefix}' 
          detail='${addOrRemove}' 
          icon='${addOrRemove}-circle'
        ></movie-masher-link>
      `
    }

    currentValue(name: string): Scalar | undefined  {
      const found = this.namePropertyId(name)
      if (!found) return

      return this.propertyIdValue(found)
    }

    protected handleChanged(event: EventEdited) {
      const { detail: edit } = event  
      const { propertyIds, updatePropertyIds } = this
      if (!propertyIds?.length) return
  
      const { affects } = edit
      if (updatePropertyIds.some(id => affects.includes(id))) {
        this.dispatchEvent(new EventRequestUpdate())
        
        return
      }
      if (propertyIds.some(id => affects.includes(id))) {
        // console.debug(this.tagName, 'handleChanged', action, affects)
        this.requestUpdate()
      } 
    }

    namePropertyId(name: string): PropertyId | undefined {
      return this.propertyIds?.find(id => id.endsWith(`${DOT}${name}`))
    }

    propertyIds?: PropertyIds

    updatePropertyIds: PropertyIds = []

    selectedProperty(propertyId: PropertyId): SelectedProperty | undefined {
      const propertiesEvent = new EventSelectedProperties([propertyId])
      MOVIEMASHER.dispatch(propertiesEvent)
      const { selectedProperties } = propertiesEvent.detail
      if (!selectedProperties?.length) {
        // console.warn(this.tagName, 'addOrRemoveEnd', 'no selected properties')
        return
      }
      const [selectedProperty] = selectedProperties
      return selectedProperty
    }

    propertyIdValue(found: string): Scalar | undefined {
      const propertyId = isPropertyId(found) ? found : this.namePropertyId(found)
      if (!propertyId) return

      const event = new EventScalar(propertyId)
      MOVIEMASHER.dispatch(event)
      return event.detail.value 
    }

    propertyNameContent(name: string): OptionalContent {
      const { propertyIds } = this
      const id = propertyIds?.find(id => id.endsWith(`${DOT}${name}`))
      if (!id) return
  
      this.loadComponent('movie-masher-icon')
      return html`
        <div>
          <movie-masher-icon icon='${name}'></movie-masher-icon>
          ${this.controlInputContent(id)}
        </div>
      `
    }
  }
}

export const CONTROL_GROUP_CSS: CSSResultGroup = [
  css`
    :host {
      --gap: var(--gap-control);
    }

    fieldset {
      flex-grow: 1;
      line-height: var(--height-control);
      font-size: var(--height-control);
      padding: var(--gap);
      background-color: initial;
      border-color: var(--fore);
      border-width: var(--size-border);
      border-radius: var(--radius-border);
    }

    fieldset > legend > movie-masher-icon,
    fieldset > div > movie-masher-icon  {
      display: inline-block;
      min-width: 1em;
      min-height: 1em;
    }
    
    fieldset > div {
      display: flex;
      gap: var(--gap);
      grid-auto-flow: column;
      margin-bottom: var(--gap);
    }

  `
]

export const CONTROL_GROUP_DECLARATIONS: PropertyDeclarations = {
  propertyIds: { type: Array },
}

export function ControlMixin<T extends Constrained<Component & ControlProperty>>(Base: T):
  T & Constrained<Control> {
  return class extends Base implements Control {
    constructor(...args: any[]) {
      super(...args)
      this.listeners[EventEdited.Type] = this.handleChanged.bind(this)
    }

    get endValueDefined(): boolean {
      const { propertyId } = this
      if (!propertyId) return false

      const event = new EventScalar(`${propertyId}${$END}`)
      MOVIEMASHER.dispatch(event)
      return isDefined(event.detail.value)
    }

    private handleChanged(event: EventEdited): void {
      const { propertyId } = this
      if (!propertyId) return

      const { detail: edit } = event
      if (!edit.affects.includes(propertyId)) return

      this.setInputValue(this.scalar)
    }

    handleInput(): void {
      const { selectedProperty, input, propertyId } = this
      if (!(selectedProperty && input && propertyId)) return

      const { inputValue } = this
      const isEnd = propertyId.endsWith($END)
      if (isEnd || this.endValueDefined) {
        // console.debug(this.tagName, propertyId, 'handleInput $END DEFINED')
        const event = new EventTimeRange()
        MOVIEMASHER.dispatch(event)
        const { detail: { timeRange } } = event
        if (timeRange) {
          const frame = isEnd ? timeRange.last : timeRange.frame
          // console.debug(this.tagName, propertyId, 'handleInput GOING', frame)
          MOVIEMASHER.dispatch(new EventChangeFrame(frame))
        }
      }
      // console.debug(this.tagName, this.propertyId, 'handleInput', inputValue)
      selectedProperty.value = inputValue

      MOVIEMASHER.dispatch(new EventChangeScalar(propertyId, inputValue))
    }

    get input(): ControlInput | undefined {
      const { shadowRoot } = this
      if (!shadowRoot) return

      return (
        shadowRoot.querySelector('input')
        || shadowRoot.querySelector('select')
        || undefined
      )
    }

    get inputSelectContent(): OptionalContent {
      const { property } = this
      if (!property) return

      const { name, options = [] } = property
      const value = this.scalar
      const htmls = options.map(id => html`
        <option ?selected='${value === id}' value='${id}'>${id}</option>
      `)
      return html`
        <select @input='${this.handleInput}' name='${name}'>${htmls}</select>
      `
    }

    get inputValue(): Scalar | undefined {
      const { input } = this
      return input ? input.value : undefined
    }

    get property(): Property | undefined {
      return this.selectedPropertyOrLoad?.property
    }

    get scalar(): Scalar | undefined {
      const { propertyId } = this
      if (!propertyId) return

      const event = new EventScalar(propertyId)
      MOVIEMASHER.dispatch(event)
      return event.detail.value
    }

    selectedProperty?: SelectedProperty

    private get selectedPropertyOrLoad(): SelectedProperty | undefined {
      return this.selectedProperty ||= this.selectedPropertyInitialize
    }

    private get selectedPropertyInitialize(): SelectedProperty | undefined {
      const { propertyId } = this
      if (!isPropertyId(propertyId)) {
        // console.warn(this.tagName, 'selectedPropertyInitialize', 'no propertyId')
        return
      }
      const selectedProperties: SelectedProperties = []
      const event = new EventSelectedProperties([propertyId], selectedProperties)
      MOVIEMASHER.dispatch(event)
      const { length } = selectedProperties
      switch (length) {
        case 0: {
          // console.warn(this.tagName, 'selectedPropertyInitialize', 'no selectedProperties')
          return
        }
        case 1: break
        default: {
          // console.warn(this.tagName, 'selectedPropertyInitialize', length, 'selectedProperties')
        }
      }
      const [property] = selectedProperties
      return property
    }

    setInputValue(value?: Scalar): boolean {
      const { input } = this
      if (!(input && isDefined(value))) return false

      if (value === this.inputValue) return false

      if (input instanceof HTMLInputElement && input.type === 'checkbox') {
        input.checked = Boolean(value)
      } else input.value = String(value)
      return true
    }

    protected override willUpdate(changedProperties: PropertyValues<this>): void {
      super.willUpdate(changedProperties)
      if (changedProperties.has('selectedId')) {
        // console.debug(this.tagName, 'willUpdate selectedId', this.selectedId)
        this.selectedProperty = this.selectedPropertyInitialize
      }
    }
  }
}


export const CONTROL_PROPERTY_DECLARATIONS: PropertyDeclarations = {
  propertyId: { type: String, attribute: 'property-id' },
  selectedId: { type: String, attribute: false },
}


export const CONTROL_DECLARATIONS: PropertyDeclarations = {
  ...CONTROL_PROPERTY_DECLARATIONS,
  // selectedProperty: { type: Object, attribute: false },
}

export function ControlPropertyMixin<T extends Constrained<Component>>(Base: T):
  T & Constrained<ControlProperty> {
  return class extends Base implements ControlProperty {
    override connectedCallback(): void {
      const { targetId } = this
      if (isTargetId(targetId)) {
        // console.debug(this.tagName, 'connectedCallback listening for changes to', targetId)
        switch (targetId) {
          case $ASSET: {
            this.listeners[EventChangedAssetId.Type] = this.handleChangedAssetId.bind(this)
            break
          }
          case $MASH: {
            this.listeners[EventChangedMashAsset.Type] = this.handleChangedMashAsset.bind(this)
            break
          }
          default: {
            this.listeners[EventChangedClipId.Type] = this.handleChangedClipId.bind(this)
          }
        }
        this.selectedId = this.selectedIdDefined
      }
      super.connectedCallback()
    }

    protected handleChangedAssetId(event: EventChangedAssetId): void {
      this.selectedId = event.detail
    }

    protected handleChangedClipId(event: EventChangedClipId): void {
      const { detail: id } = event
      // console.log(this.tagName, 'handleChangedClipId', id)
      this.selectedId = id
    }

    protected handleChangedMashAsset(event: EventChangedMashAsset): void {
      const { detail: mashAsset } = event
      const id = mashAsset?.id
      // console.log(this.tagName, 'handleChangedMashAsset', id)
      this.selectedId = id
    }

    propertyId?: PropertyId

    selectedId?: string

    private get selectedIdDefined(): string | undefined {
      const { selectedId } = this
      if (selectedId) return selectedId

      const { targetId } = this
      if (!targetId) return

      switch (targetId) {
        case $MASH: {
          const event = new EventMashAsset()
          MOVIEMASHER.dispatch(event)
          return event.detail.mashAsset?.id
        }
        case $ASSET: {
          const event = new EventAssetId()
          MOVIEMASHER.dispatch(event)
          return event.detail.assetId
        }
        default: {
          const event = new EventClipId()
          MOVIEMASHER.dispatch(event)
          return event.detail.clipId
        }
      }
    }

    get targetId(): TargetId | undefined {
      const { propertyId } = this
      if (!propertyId) {
        console.warn(this.tagName, 'targetId', 'propertyId undefined')
        return
      }
      const [id] = propertyId.split(DOT)
      return isTargetId(id) ? id : undefined
    }
  }
}

export const AssetControlTag = 'movie-masher-control-asset'

const AssetWithControlProperty = ControlPropertyMixin(Component)
const AssetWithControl = ControlMixin(AssetWithControlProperty)
const AssetWithSizeReactive = SizeReactiveMixin(AssetWithControl)
const AssetWithDropTarget = DropTargetMixin(AssetWithSizeReactive)
/**
 * @category Elements
 */
export class AssetControlElement extends AssetWithDropTarget implements Control {
  override acceptsClip = false

  protected override get defaultContent(): OptionalContent {
    const { property, iconSize } = this
    if (!(iconSize && property)) return 

    const value = this.scalar
    const { name, options } = property
    this.setInputValue(value)
    
    if (options?.length) return this.inputSelectContent

    const { icon } = this
    return html`
      <input 
        type='hidden' 
        name='${name}' 
        aria-label='${name}'
        value='${value || ''}'
      />
      <div 
        style='width:${iconSize.width}px;height:${iconSize.height}px;'
      >${icon}<div class='drop-box'></div></div>
    `
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
    MOVIEMASHER.dispatch(event)
    const { promise } = event.detail 
    if (!promise) return Promise.resolve()

    return promise.then(elementOrError => {
      if (isDefiniteError(elementOrError)) return 
      
      const { data: icon } = elementOrError
      this._icon = icon
      this.requestUpdate()
    })
  }

  private get iconSize(): Size | undefined {
    const { size } = this
    if (!size) {
      // console.log(this.tagName, this.propertyId, 'iconSize', 'no size')
      return
    }
    
    const max = this.variable('size-preview')
    const ratio = this.variable('ratio-preview')
    const contained = containSize(size, max * ratio)
    // console.log(this.tagName, this.propertyId, 'iconSize', { contained, size, max, ratio })
    return contained
  }

  private iconUpdate() {
    const { icon } = this
    if (!icon) return
    
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
  
  private dropFiles = async (fileList: FileList): Promise<void> => {
    const dropPromise = dropRawFiles(fileList)
    if (dropPromise) {
      const assetObjects = await dropPromise
      
      const [assetObject] = assetObjects
      if (!assetObject) return

      const assetEvent = new EventManagedAssetPromise(assetObject)
      MOVIEMASHER.dispatch(assetEvent)

      const { promise } = assetEvent.detail
      if (!promise) return
    
      const orError = await promise
      if (isDefiniteError(orError)) return
      
      const { data: asset } = orError
      if (!isClientAsset(asset)) return

      this.setInputValue(assetObject.id)
      // console.log(this.tagName, this.propertyId, 'handleDropped', assetObject)
    }
  }


  override handleDropped(event: DragEvent): void {
    const { dataTransfer } = event
    // console.log(this.tagName, this.propertyId, 'handleDropped', !!dataTransfer)
    assertDefined(dataTransfer)

    if (droppingFiles(dataTransfer)) {
      this.dropFiles(dataTransfer.files)
      return 
    }
    
    const data = dragData(dataTransfer)
    if (isDragAssetObject(data)) {
      const { assetId } = data
      this.setInputValue(assetId)
      this.handleInput()
    }
  }
 
  override setInputValue(value?: Scalar): boolean {
    const changed = super.setInputValue(value)
    if (changed) this.iconUpdate()
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
    const element = document.createElement(AssetControlTag)
    element.propertyId = propertyId
    return element
  }

  static handleNode(event: EventControl) {
    const { detail } = event
    const { type } = detail
    if (![$CONTAINER_ID, $CONTENT_ID].includes(type)) return
    
    detail.control = AssetControlElement.instance(detail)
    event.stopImmediatePropagation()
  }

  static override properties: PropertyDeclarations = {
    ...CONTROL_DECLARATIONS,
    ...SIZE_REACTIVE_DECLARATIONS,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    DROP_TARGET_CSS,
    css`
      :host {
        --ratio-preview-inspector: var(--ratio-preview, 0.20);
      }
      :host > div {
        border: var(--border);
        border-radius: var(--radius-border);
        display: inline-block;
        overflow: hidden;
        position: relative;
      }
    `
  ]
}

customElements.define(AssetControlTag, AssetControlElement)

declare global {
  interface HTMLElementTagNameMap {
    [AssetControlTag]: AssetControlElement
  }
}

// listen for control asset event
export const ClientControlAssetListeners: ListenersFunction = () => ({
  [EventControl.Type]: AssetControlElement.handleNode
})

export const BooleanControlTag = 'movie-masher-control-boolean'

const BooleanWithControlProperty = ControlPropertyMixin(Component)
const BooleanWithControl = ControlMixin(BooleanWithControlProperty)
/**
 * @category Elements
 */
export class BooleanControlElement extends BooleanWithControl implements Control {
  protected override get defaultContent(): OptionalContent {
    const { property, scalar: value } = this
    if (!property) return

    const { name } = property
    return html`
      <input 
        @input='${this.handleInput}'
        ?checked='${Boolean(value)}'
        type='checkbox'
        name='${name}' 
        aria-label='${name}'
      />
    `
  }

  override get inputValue(): Scalar | undefined {
    const { input } = this
    return input ? (input as HTMLInputElement).checked : undefined
  }

  static instance(args: EventControlDetail) {
    const { propertyId } = args
    const element = document.createElement(BooleanControlTag)
    element.propertyId = propertyId
    return element
  }

  static handleNode(event: EventControl) {
    const { detail } = event
    const { type } = detail
    if (type !== $BOOLEAN) return
    
    detail.control = BooleanControlElement.instance(detail)
    event.stopImmediatePropagation()
  }

  static override properties: PropertyDeclarations = {
    ...CONTROL_DECLARATIONS,
  }


  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
  ]
}

customElements.define(BooleanControlTag, BooleanControlElement)

declare global {
  interface HTMLElementTagNameMap {
    [BooleanControlTag]: BooleanControlElement
  }
}

// listen for control boolean event
export const ClientControlBooleanListeners: ListenersFunction = () => ({
  [EventControl.Type]: BooleanControlElement.handleNode
})



export const NumericControlTag = 'movie-masher-control-numeric'

const NumericWithControlProperty = ControlPropertyMixin(Component)
const NumericWithControl = ControlMixin(NumericWithControlProperty)
/**
 * @category Elements
 */
export class NumericControlElement extends NumericWithControl {
  protected override get defaultContent(): OptionalContent {
    const { property, scalar: value } = this
    if (!property) return

    const { max, min, name, step, type, options } = property
    this.setInputValue(value)
    if (options?.length) return this.inputSelectContent

    return html`
      <input 
        @input='${this.handleInput}'
        type='${type === $PERCENT ? 'range' : 'number'}'
        name='${name}' 
        aria-label='${name}'
        max='${max || ''}'
        min='${isDefined<number>(min) ? min : ''}'
        step='${step || ''}'
        value='${isDefined<number>(value) ? value : ''}'
      />
    `
  }

  override get inputValue(): Scalar | undefined {
    const { property, input } = this
    if (!(property && input)) return

    const { step } = property

    const { value: stringValue } = input
    return step === 1 ? parseInt(stringValue) : parseFloat(stringValue)
  }
  

  static instance(detail: EventControlDetail) {
    const { propertyId } = detail
    const element = document.createElement(NumericControlTag)
    element.propertyId = propertyId
    return element
  }

  static handleNode(event: EventControl) {
    const { detail } = event
    const { type } = detail
    if (!NumericControlElement.types.includes(type)) return
    
    detail.control = NumericControlElement.instance(detail)
    event.stopImmediatePropagation()
  }

  static override properties: PropertyDeclarations = {
    ...CONTROL_DECLARATIONS,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    css`
      input {
        flex-grow: 1;
        width: 100%;
        min-width: 50px;
        height: var(--height-control);
        accent-color: var(--fore);
      }
      input:hover {
        accent-color: var(--over);
      }
    `
  ]

  private static types = [$FRAME, $NUMBER, $PERCENT]
}

customElements.define(NumericControlTag, NumericControlElement)

declare global {
  interface HTMLElementTagNameMap {
    [NumericControlTag]: NumericControlElement
  }
}

// listen for control numeric event
export const ClientControlNumericListeners: ListenersFunction = () => ({
  [EventControl.Type]: NumericControlElement.handleNode
})

export const RgbControlTag = 'movie-masher-control-rgb'

const RgbWithControlProperty = ControlPropertyMixin(Component)
const RgbWithControl = ControlMixin(RgbWithControlProperty)
/**
 * @category Elements
 */
export class RgbControlElement extends RgbWithControl {
  protected override get defaultContent(): OptionalContent {
    const { property, scalar: value } = this
    if (!property) {
      console.warn(this.tagName, 'no selectedProperty', this.propertyId)
      return
    }
    const { name } = property
    // console.debug(this.tagName, 'defaultContent', name, value)
    this.setInputValue(value)
    return html`
      <input 
        @input='${this.handleInput}'
        type='color'
        name='${name}' 
        aria-label='${name}'
        value='${value || ''}'
      />
    `
  }

  static instance(detail: EventControlDetail) {
    const { propertyId } = detail
    const element = document.createElement(RgbControlTag)
    element.propertyId = propertyId
    return element
  }

  static handleNode(event: EventControl) {
    const { detail } = event
    const { type } = detail
    if (type !== $RGB) return
    
    // console.log('RgbControlElement.handleNode', type) 
    detail.control = RgbControlElement.instance(detail)
    event.stopImmediatePropagation()
  }

  static override properties: PropertyDeclarations = {
    ...CONTROL_DECLARATIONS, 
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    css`
      input {
        flex-grow: 1;
        min-width: 50px;
        width: 100%;
        height: var(--height-control);
        accent-color: var(--fore);
      }
      
      input:hover {
        accent-color: var(--over);
      }
    `
  ]
}

customElements.define(RgbControlTag, RgbControlElement)

declare global {
  interface HTMLElementTagNameMap {
    [RgbControlTag]: RgbControlElement
  }
}

// listen for control event
MOVIEMASHER.listenersAdd({ [EventControl.Type]: RgbControlElement.handleNode })

// listen for control rgb event
export const ClientControlRgbListeners: ListenersFunction = () => ({
  [EventControl.Type]: RgbControlElement.handleNode
})



export const StringControlTag = 'movie-masher-control-string'

const StringWithControlProperty = ControlPropertyMixin(Component)
const StringWithControl = ControlMixin(StringWithControlProperty)
/**
 * @category Elements
 */
export class StringControlElement extends StringWithControl {
  protected override get defaultContent(): OptionalContent {
    const { property, scalar: value } = this
    if (!property) return

    const { name, options } = property
    this.setInputValue(value)
    
    if (options?.length) return this.inputSelectContent

    return html`
      <input 
        @input='${this.handleInput}'
        type='text'
        name='${name}' 
        aria-label='${name}'
        value='${value || ''}'
      />
    `
  }

  static instance(detail: EventControlDetail) {
    const { propertyId } = detail
    const element = document.createElement(StringControlTag)
    element.propertyId = propertyId
    return element

  }

  static handleNode(event: EventControl) {
    const { detail } = event
    const { type } = detail
    if (type !== $STRING) return
    
    detail.control = StringControlElement.instance(detail)
    event.stopImmediatePropagation()
  }
  static override properties: PropertyDeclarations = {
    ...CONTROL_DECLARATIONS
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    css`
      input {
        flex-grow: 1;
        width: 100%;
        min-width: 50px;
        height: var(--height-control);
      }`
  ]
}

customElements.define(StringControlTag, StringControlElement)

declare global {
  interface HTMLElementTagNameMap {
    [StringControlTag]: StringControlElement
  }
}

// listen for control string event
export const ClientControlStringListeners: ListenersFunction = () => ({
  [EventControl.Type]: StringControlElement.handleNode
})


export const AspectControlGroupTag = 'movie-masher-control-group-aspect'

const AspectWithControlGroup = ControlGroupMixin(ComponentLoader)
/**
 * @category Elements
 */
export class AspectControlGroupElement extends AspectWithControlGroup implements ControlGroup {
  protected override get defaultContent(): OptionalContent {
    const { propertyIds } = this
    if (!propertyIds?.length) return

    const aspectWidthId = this.namePropertyId(`aspectWidth`)
    const aspectHeightId = this.namePropertyId(`aspectHeight`)
    const aspectShortestId = this.namePropertyId(`aspectShortest`)

    const width = Number(aspectWidthId ? this.propertyIdValue(aspectWidthId) : 0)
    const height = Number(aspectHeightId ? this.propertyIdValue(aspectHeightId) : 0)
    const icon = width === height ? 'square' : (width > height ? 'landscape' : 'portrait')

    this.loadComponent('movie-masher-action-client')
    this.loadComponent('movie-masher-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-icon icon='aspect'></movie-masher-icon>
        </legend>
        <div>
          <movie-masher-icon icon='${icon}'></movie-masher-icon>
          ${this.controlInputContent(aspectWidthId)}
          /
          ${this.controlInputContent(aspectHeightId)}
          <movie-masher-action-client 
            icon='${$FLIP}' detail='${$FLIP}'
          ></movie-masher-action-client>
        </div>
        <div>
          <movie-masher-icon icon='aspectShortest'></movie-masher-icon>
          ${this.controlInputContent(aspectShortestId)} P
        </div>
      </fieldset>
    `
  }
  
  static handleControlGroup(event: EventControlGroup) {
    const { detail } = event
    const { propertyIds, groupedPropertyIds } = detail
    const remainingIds = propertyIds.filter(id => 
      !groupedPropertyIds.includes(id)
    )
    const { names } = AspectControlGroupElement
    const foundIds = remainingIds.filter(id => names.some(name => id.endsWith(`${DOT}${name}`)))
    if (foundIds.length) {
      // console.log('AspectControlGroupElement.handleControlGroup', propertyIds, remainingIds, foundIds, names)
      detail.order = 1
      detail.controlGroup = AspectControlGroupElement.instance(foundIds)
      detail.groupedPropertyIds.push(...foundIds)
      event.stopImmediatePropagation()
    }
  }

  static instance(propertyIds: PropertyIds) {
    const element = document.createElement(AspectControlGroupTag)
    element.propertyIds = propertyIds
    return element
  }

  private static names: Strings = [
    'aspectWidth', 'aspectHeight', 'aspectShortest',
  ]

  static override properties: PropertyDeclarations = {
    ...CONTROL_GROUP_DECLARATIONS,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    CONTROL_GROUP_CSS,
  ]
}

customElements.define(AspectControlGroupTag, AspectControlGroupElement)

declare global {
  interface HTMLElementTagNameMap {
    [AspectControlGroupTag]: AspectControlGroupElement
  }
}

// listen for control group event
export const ClientGroupAspectListeners: ListenersFunction = () => ({
  [EventControlGroup.Type]: AspectControlGroupElement.handleControlGroup
})

export const DimensionsControlGroupTag = 'movie-masher-control-group-dimensions'

const WithControlGroup = ControlGroupMixin(ComponentLoader)
const WithSizeReactive = SizeReactiveMixin(WithControlGroup)
/**
 * @category Elements
 */
export class DimensionsControlGroupElement extends WithSizeReactive implements ControlGroup {
  override connectedCallback(): void {
    const heightId = this.namePropertyId(`${$HEIGHT}${$END}`)
    if (heightId) {
      const [target] = heightId.split(DOT)
      const key = `control-group-${target}-${$HEIGHT}`
      this.listeners[key] = this.handleHeight.bind(this)
    }

    const widthId = this.namePropertyId(`${$WIDTH}${$END}`)
    if (widthId) {
      const [target] = widthId.split(DOT)
      const key = `control-group-${target}-${$WIDTH}`
      this.listeners[key] = this.handleWidth.bind(this)
    }
    super.connectedCallback()
  }

  protected override get defaultContent(): OptionalContent {
    const { propertyIds, size } = this
    if (!(size && propertyIds?.length)) return


    const aspectFlip = this.propertyIdValue(`size${$ASPECT}`) === $FLIP
    const portrait = size.height > size.width
    const aspectIcon = portrait ? 'landscape' : 'portrait' 

    this.loadComponent('movie-masher-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-icon icon='size'></movie-masher-icon>
        </legend>
        ${this.propertyNameContent($LOCK)}
        ${this.dimensionsContent(aspectFlip, portrait)}
        ${this.controlContent(`${$SIZE}${$ASPECT}`, aspectIcon)}
      </fieldset>
    `
  }

  private dimensionsContent(aspectFlip: boolean, portrait: boolean): TemplateContents {
    const contents: TemplateContents = []
    const flipped = aspectFlip && portrait
    const widthIcon = flipped ? $HEIGHT : $WIDTH
    const heightIcon = flipped ? $WIDTH : $HEIGHT
    // const lock = this.propertyIdValue($LOCK)
    const use: BooleanRecord = { width: true, height: true }
    // if (lock) {
    //   switch(lock) {
    //     case $NONE: break
    //     case $WIDTH: {
    //       // use.height = false
    //       break
    //     }
    //     case $HEIGHT: {
    //       // use.width = false
    //       break
    //     }
    //     default: {
         
    //       if (lock === $LONGEST) {
    //         use[flipped ? $HEIGHT : $WIDTH] = false
    //       } else use[!flipped ? $HEIGHT : $WIDTH] = false
            
    //     }
    //   }
    // }
    
    if (use.width) {
      const widthContent = this.controlContent($WIDTH, widthIcon)
      if (widthContent) contents.push(widthContent)
    }
    if (use.height) {
      const heightContent = this.controlContent($HEIGHT, heightIcon)
      if (heightContent) contents.push(heightContent)
    }
    return contents
  }

  override updatePropertyIds: PropertyIds = [`${$CONTAINER}${DOT}lock`]
        
  static handleControlGroup(event: EventControlGroup) {
    const { detail } = event
    const { propertyIds, groupedPropertyIds } = detail
    const remainingIds = propertyIds.filter(id => 
      !groupedPropertyIds.includes(id)
    )
    const { names } = DimensionsControlGroupElement
    const foundIds = remainingIds.filter(id => names.some(name => id.endsWith(`${DOT}${name}`)))
    if (foundIds.length) {
      // console.log('DimensionsControlGroupElement.handleControlGroup', propertyIds, remainingIds, foundIds, names)
      detail.order = 2
      detail.controlGroup = DimensionsControlGroupElement.instance(foundIds)
      detail.groupedPropertyIds.push(...foundIds)
      event.stopImmediatePropagation()
    }
  }

  protected handleHeight(event: StringEvent) {
    event.stopImmediatePropagation()
    this.addOrRemoveEnd(event.detail, $HEIGHT)
  }
 
  protected handleWidth(event: StringEvent) {
    event.stopImmediatePropagation()
    this.addOrRemoveEnd(event.detail, $WIDTH)
  }

  static instance(propertyIds: PropertyIds) {
    const element = document.createElement(DimensionsControlGroupTag)
    element.propertyIds = propertyIds
    return element
  }

  private static names: Strings = [
    ...SIZE_KEYS.flatMap(key => [key, `${key}${$END}`]),
    $LOCK, `size${$ASPECT}`,
  ]

  static override properties: PropertyDeclarations = {
    ...CONTROL_GROUP_DECLARATIONS,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    CONTROL_GROUP_CSS,
  ]
}

customElements.define(DimensionsControlGroupTag, DimensionsControlGroupElement)

declare global {
  interface HTMLElementTagNameMap {
    [DimensionsControlGroupTag]: DimensionsControlGroupElement
  }
}

// listen for control group event
export const ClientGroupDimensionsListeners: ListenersFunction = () => ({
  [EventControlGroup.Type]: DimensionsControlGroupElement.handleControlGroup
})

export const FillControlGroupTag = 'movie-masher-control-group-fill'

const FillWithControlGroup = ControlGroupMixin(ComponentLoader)
/**
 * @category Elements
 */
export class FillControlGroupElement extends FillWithControlGroup implements ControlGroup {
  override connectedCallback(): void {
    const { propertyIds } = this
    if (!propertyIds?.length) return
    
    const colorId = this.namePropertyId(`color${$END}`)
    if (colorId) {
      const [target] = colorId.split(DOT)
      const key = `control-group-${target}-color`     
      this.listeners[key] = this.handleColor.bind(this)
    }
    const opacityId = this.namePropertyId(`opacity${$END}`)
    if (opacityId) {
      const [target] = opacityId.split(DOT)
      const key = `control-group-${target}-opacity`     
      this.listeners[key] = this.handleOpacity.bind(this)
    }
    super.connectedCallback()
  }

  protected override get defaultContent(): OptionalContent {
    const { propertyIds } = this
    if (!propertyIds?.length) return

    this.loadComponent('movie-masher-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-icon icon='visible'></movie-masher-icon>
        </legend>
        ${this.controlContent('color')}
        ${this.controlContent($OPACITY)}
      </fieldset>
    `
  }

  protected handleColor(event: StringEvent) {
    // console.debug(this.tagName, 'handleColor', event.detail)
    this.addOrRemoveEnd(event.detail, 'color')
    event.stopImmediatePropagation()
  }

  protected handleOpacity(event: StringEvent) {
    // console.debug(this.tagName, 'handleOpacity', event.detail)
    this.addOrRemoveEnd(event.detail, $OPACITY)
    event.stopImmediatePropagation()
  }

  static handleControlGroup(event: EventControlGroup) {
    const { detail } = event
    const { propertyIds, groupedPropertyIds } = detail
    const remainingIds = propertyIds.filter(id => 
      !groupedPropertyIds.includes(id)
    )
    const { names } = FillControlGroupElement
    const foundIds = remainingIds.filter(id => names.some(name => id.endsWith(`${DOT}${name}`)))
    if (foundIds.length) {
      // console.log('FillControlGroupElement.handleControlGroup', propertyIds, remainingIds, foundIds, names)
      detail.order = 4
      detail.controlGroup = FillControlGroupElement.instance(foundIds)
      detail.groupedPropertyIds.push(...foundIds)
      event.stopImmediatePropagation()
    }
  }

  static instance(propertyIds: PropertyIds) {
    const element = document.createElement(FillControlGroupTag)
    element.propertyIds = propertyIds
    return element
  }

  private static names: Strings = [
    'color', 'colorEnd', $OPACITY, [$OPACITY, $END].join('')
  ]

  static override properties: PropertyDeclarations = {
    ...CONTROL_GROUP_DECLARATIONS,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    CONTROL_GROUP_CSS,
  ]
}

customElements.define(FillControlGroupTag, FillControlGroupElement)

declare global {
  interface HTMLElementTagNameMap {
    [FillControlGroupTag]: FillControlGroupElement
  }
}

// listen for control group event
export const ClientGroupFillListeners: ListenersFunction = () => ({
  [EventControlGroup.Type]: FillControlGroupElement.handleControlGroup
})

export const LocationControlGroupTag = 'movie-masher-control-group-location'
const EventLocationControlGroupType = 'point-control-group'

const LocationWithControlGroup = ControlGroupMixin(ComponentLoader)
const LocationWithSizeReactive = SizeReactiveMixin(LocationWithControlGroup)
const LocationFlippedProperties = {
  [$TOP]: $LEFT,
  [$BOTTOM]: $RIGHT,
  [$LEFT]: $TOP,
  [$RIGHT]: $BOTTOM
}

/**
 * @category Elements
 */
export class LocationControlGroupElement extends LocationWithSizeReactive implements ControlGroup {
  constructor() {
    super()
    this.listeners[EventLocationControlGroupType] = this.handleDirection.bind(this)
  }

  override connectedCallback(): void {
    const xId = this.namePropertyId(`x${$END}`)
    if (xId) {
      const [target] = xId.split(DOT)
      const key = `control-group-${target}-x`     
      this.listeners[key] = this.handleX.bind(this)
    }
    const yId = this.namePropertyId(`y${$END}`)
    if (yId) {
      const [target] = yId.split(DOT)
      const key = `control-group-${target}-y`     
      this.listeners[key] = this.handleY.bind(this)
    }
    super.connectedCallback()
  }

  private constrainedContent(flipped: boolean): OptionalContent {
    this.loadComponent('movie-masher-link')
    const contents: TemplateContents = DIRECTIONS_SIDE.flatMap(direction => {
      const propertyName = `${direction}${$CROP}`
      const propertyId = this.namePropertyId(propertyName)
      if (!propertyId) return []

      const value = this.propertyIdValue(propertyId)
      const icon = flipped ? LocationFlippedProperties[direction] : direction
      return [html`
        <movie-masher-link
          emit='${EventLocationControlGroupType}' detail='${direction}'
          icon='${icon}' 
          selected='${value || nothing}'
        ></movie-masher-link>
      `]
    })
    if (!contents.length) return

    this.loadComponent('movie-masher-icon')
    return html`
      <div>
        <movie-masher-icon icon='crop'></movie-masher-icon>
        ${contents}
      </div>
    `
  }

  protected override get defaultContent(): OptionalContent {
    const { propertyIds, size } = this
    if (!(size && propertyIds?.length)) return

    const aspectFlip = this.propertyIdValue(`point${$ASPECT}`) === $FLIP
    const portrait = size.height > size.width
    const aspectIcon = portrait ? 'landscape' : 'portrait' 
    const xIcon = portrait && aspectFlip ? 'y' : 'x'
    const yIcon = portrait && aspectFlip ? 'x' : 'y'
    
    this.loadComponent('movie-masher-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-icon icon='point'></movie-masher-icon>
        </legend>
        ${this.controlContent('x', xIcon)}
        ${this.controlContent('y', yIcon)}
        ${this.constrainedContent(portrait && aspectFlip)}
        ${this.controlContent(`point${$ASPECT}`, aspectIcon)}
      </fieldset>
    `
  }
  
  private handleDirection(event: StringEvent) {
    const { detail: direction } = event
    const propertyName = `${direction}${$CROP}`
    const propertyId = this.namePropertyId(propertyName)
    if (!propertyId) return
    
    const scalar = this.propertyIdValue(propertyId)
    MOVIEMASHER.dispatch(new EventChangeScalar(propertyId, !scalar))
  }

  protected handleX(event: StringEvent) {
    // console.debug(this.tagName, 'handleX', event.detail)
    this.addOrRemoveEnd(event.detail, 'x')
    event.stopImmediatePropagation()
  }

  protected handleY(event: StringEvent) {
    // console.debug(this.tagName, 'handleY', event.detail)
    this.addOrRemoveEnd(event.detail, 'y')
    event.stopImmediatePropagation()
  }

  static handleControlGroup(event: EventControlGroup) {
    const { detail } = event
    const { propertyIds, groupedPropertyIds } = detail
    const remainingIds = propertyIds.filter(id => 
      !groupedPropertyIds.includes(id)
    )
    const { names } = LocationControlGroupElement
    const foundIds = remainingIds.filter(id => names.some(name => id.endsWith(`${DOT}${name}`)))
    if (foundIds.length) {
      // console.log('LocationControlGroupElement.handleControlGroup', foundIds, names)
      detail.order = 1
      detail.controlGroup = LocationControlGroupElement.instance(foundIds)
      detail.groupedPropertyIds.push(...foundIds)
      event.stopImmediatePropagation()
    }
  }

  static instance(propertyIds: PropertyIds) {
    const element = document.createElement(LocationControlGroupTag)
    element.propertyIds = propertyIds
    return element
  }

  private static names: Strings = [
    ...DIRECTIONS_SIDE.map(direction => `${direction}${$CROP}`),
    ...POINT_KEYS.flatMap(key => ([key, `${key}${$END}`])),
    `point${$ASPECT}`,
  ]

  static override properties: PropertyDeclarations = {
    ...CONTROL_GROUP_DECLARATIONS,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    CONTROL_GROUP_CSS,
  ]
}

customElements.define(LocationControlGroupTag, LocationControlGroupElement)

declare global {
  interface HTMLElementTagNameMap {
    [LocationControlGroupTag]: LocationControlGroupElement
  }
}

// listen for control group event
export const ClientGroupLocationListeners: ListenersFunction = () => ({
  [EventControlGroup.Type]: LocationControlGroupElement.handleControlGroup
})

export const TimeControlGroupTag = 'movie-masher-control-group-time'

const TimeWithControlGroup = ControlGroupMixin(ComponentLoader)
/**
 * @category Elements
 */
export class TimeControlGroupElement extends TimeWithControlGroup implements ControlGroup {
  private get framedContent(): OptionalContent {
    const htmls: TemplateContents = []
    const frameId = this.namePropertyId($FRAME)
    const frameInput = this.controlInputContent(frameId)
    if (frameInput) htmls.push(html`
      <movie-masher-icon icon='frame'></movie-masher-icon>
      ${frameInput}
    `)
    const framesId = this.namePropertyId('frames')
    const framesInput = this.controlInputContent(framesId)
    // console.log('TimeControlGroupElement.framedContent', framesId, framesInput)
    if (framesInput) htmls.push(html`
      <movie-masher-icon icon='frames'></movie-masher-icon>
      ${framesInput}
    `)
    if (!htmls.length) return

    return html`<div>${htmls}</div>`
  }

  private get trimmedContent(): OptionalContent {
    const htmls: TemplateContents = []
    const startTrimId = this.namePropertyId('startTrim')
    const startTrimInput = this.controlInputContent(startTrimId)
    if (startTrimInput) htmls.push(html`
      <movie-masher-icon icon='startTrim'></movie-masher-icon>
      ${startTrimInput}
    `)
    const endTrimId = this.namePropertyId('endTrim')
    const endTrimInput = this.controlInputContent(endTrimId)
    // console.log('TimeControlGroupElement.framedContent', endTrimId, endTrimInput)
    if (endTrimInput) htmls.push(html`
      ${endTrimInput}
      <movie-masher-icon icon='endTrim'></movie-masher-icon>
    `)
    if (!htmls.length) return

    return html`<div>${htmls}</div>`
  }

  protected override get defaultContent(): OptionalContent {
    const { propertyIds } = this
    if (!propertyIds?.length) return

    this.loadComponent('movie-masher-icon')
    const fastIcon = html`<movie-masher-icon icon='fast'></movie-masher-icon>`
    const timelineIcon = html`<movie-masher-icon icon='timeline'></movie-masher-icon>`
    return html`
      <fieldset>
        <legend>${timelineIcon}</legend>
        ${this.controlContent('timing')}
        ${this.framedContent}
        ${this.trimmedContent}
        ${this.controlContent('speed', 'slow', fastIcon)}
      </fieldset>
    `
  }

  override updatePropertyIds: PropertyIds = [`${$CLIP}${DOT}timing`]


  static handleControlGroup(event: EventControlGroup) {
    const { detail } = event
    const { propertyIds, groupedPropertyIds } = detail
    const remainingIds = propertyIds.filter(id => 
      !groupedPropertyIds.includes(id)
    )
    const { names } = TimeControlGroupElement
    const foundIds = remainingIds.filter(id => names.some(name => id.endsWith(`${DOT}${name}`)))
    if (foundIds.length) {
      detail.controlGroup = TimeControlGroupElement.instance(foundIds)
      detail.groupedPropertyIds.push(...foundIds)
      event.stopImmediatePropagation()
    }
  }

  static instance(propertyIds: PropertyIds) {
    const element = document.createElement(TimeControlGroupTag)
    element.propertyIds = propertyIds
    return element
  }

  private static names: Strings = [$FRAME, 'frames', 'timing', 'startTrim', 'endTrim', 'speed']

  static override properties: PropertyDeclarations = {
    ...CONTROL_GROUP_DECLARATIONS,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    CONTROL_GROUP_CSS,
    css`
      movie-masher-control-input[property-id='content.endTrim'],
      movie-masher-control-input[property-id='container.endTrim'] {
        transform: rotate(180deg);
      }
    `
  ]
}

customElements.define(TimeControlGroupTag, TimeControlGroupElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimeControlGroupTag]: TimeControlGroupElement
  }
}

// listen for control group event
export const ClientGroupTimeListeners: ListenersFunction = () => ({
  [EventControlGroup.Type]: TimeControlGroupElement.handleControlGroup
})
