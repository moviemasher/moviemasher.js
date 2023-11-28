import type { ControlInput, ControlProperty, EventControlDetail, SelectedProperties, SelectedProperty, StringEvent, Timeout } from '@moviemasher/runtime-client'
import type { BooleanRecord, Constrained, DataType, ListenersFunction, Property, PropertyId, PropertyIds, Scalar, Size, Strings, TargetId } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit-element/lit-element.js'
import type { Content, Contents, Control, ControlGroup, OptionalContent } from './Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { assertDefined, assertPopulatedString, isPropertyId } from '@moviemasher/lib-shared/utility/guards.js'
import { sizeContain } from '@moviemasher/lib-shared/utility/rect.js'
import { EventAssetId, EventChangeFrame, EventChangeScalar, EventChanged, EventChangedAssetId, EventChangedClipId, EventChangedMashAsset, EventClipId, EventControl, EventControlGroup, EventDataType, EventManagedAsset, EventManagedAssetIcon, EventMashAsset, EventScalar, EventSelectedProperties, EventTimeRange, MOVIEMASHER, ROW } from '@moviemasher/runtime-client'
import { ASPECT, ASSET_TARGET, BOOLEAN, BOTTOM, CONTAINER_ID, CONTENT_ID, CROP, DIRECTIONS_SIDE, DOT, END, FLIP, FRAME, HEIGHT, LEFT, MASH, NUMBER, PERCENT, POINT_KEYS, RGB, RIGHT, SIZE_KEYS, STRING, TOP, WIDTH, isDefined, isPopulatedString } from '@moviemasher/runtime-shared'
import { html, nothing } from 'lit-html'
import { Component, ImporterComponent } from './base/Component.js'
import { isTargetId } from './guards/TypeGuards.js'
import { DROP_TARGET_CSS, DropTargetMixin, SIZE_REACTIVE_DECLARATIONS, SizeReactiveMixin } from './mixins/component.js'
import { dragData, dropRawFiles, droppingFiles, isDragAssetObject } from './utility/draganddrop.js'


export function ControlGroupMixin
<T extends Constrained<ImporterComponent>>(Base: T): 
T & Constrained<ControlGroup> {
  return class extends Base implements ControlGroup {
    constructor(...args: any[]) {
      super(...args)
      this.listeners[EventChanged.Type] = this.handleChanged.bind(this)
    }

    addOrRemoveEnd(addOrRemove: string, propertyNamePrefix: string): void {
      const value = addOrRemove ==='remove' ? undefined : this.currentValue(propertyNamePrefix)
      const endName = `${propertyNamePrefix}${END}`
      const endPropertyId = this.namePropertyId(endName)
      if (!endPropertyId) {
        // console.warn(this.tagName, 'addOrRemoveEnd', { endPropertyId, addOrRemove, value })
        return
      }
      // console.log(this.tagName, 'addOrRemoveEnd', endPropertyId)
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangeScalar(endPropertyId, value))
    }

    controlContent(name: string, icon?: string): OptionalContent {
      const id = this.namePropertyId(name)
      if (!id) return

      const iconName = icon || name

      this.importTags('movie-masher-component-icon')
      return html`
        <div>
          <movie-masher-component-icon icon='${iconName}'></movie-masher-component-icon>
          ${this.controlInputContent(id)}
          ${this.controlInputContentEnd(name)}
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
      const endName = `${namePrefix}${END}`
      const endPropertyId = propertyIds?.find(id => id.endsWith(endName))
      if (!endPropertyId) return

      const [target] = endPropertyId.split(DOT)
  
      this.importTags('movie-masher-component-a')
      const event = new EventScalar(endPropertyId)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const defined = isDefined(event.detail.value)
      const addOrRemove = defined ? 'remove' : 'add'
      const input = defined ? this.controlInputContent(endPropertyId): undefined
      return html`
        ${input}
        <movie-masher-component-a
          emit='control-group-${target}-${namePrefix}' 
          detail='${addOrRemove}' 
          icon='${addOrRemove}-circle'
        ></movie-masher-component-a>
      `
    }

    currentValue(name: string): Scalar | undefined  {
      const found = this.namePropertyId(name)
      if (!found) return

      return this.propertyIdValue(found)
    }

    private handleChanged(event: EventChanged) {
      const { detail: action } = event
      if (!action) return
  
      const { propertyIds } = this
      if (!propertyIds?.length) return
  
      const { affects } = action
      const found = propertyIds.some(id => affects.includes(id))
      if (found) {
        // console.debug(this.tagName, 'handleChanged', action)
        this.requestUpdate()
      }
    }

    namePropertyId(name: string): PropertyId | undefined {
      return this.propertyIds?.find(id => id.endsWith(name))
    }

    propertyIds?: PropertyIds

    selectedProperty(propertyId: PropertyId): SelectedProperty | undefined {
      const propertiesEvent = new EventSelectedProperties([propertyId])
      MOVIEMASHER.eventDispatcher.dispatch(propertiesEvent)
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
      MOVIEMASHER.eventDispatcher.dispatch(event)
      return event.detail.value 
    }

    propertyNameContent(name: string): OptionalContent {
      const { propertyIds } = this
      const id = propertyIds?.find(id => id.endsWith(name))
      if (!id) return
  
      this.importTags('movie-masher-component-icon')
      return html`
        <div>
          <movie-masher-component-icon icon='${name}'></movie-masher-component-icon>
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

    fieldset > legend > movie-masher-component-icon,
    fieldset > div > movie-masher-component-icon  {
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
      this.listeners[EventChanged.Type] = this.handleChanged.bind(this)
    }

    get endValueDefined(): boolean {
      const { propertyId } = this
      if (!propertyId) return false

      const event = new EventScalar(`${propertyId}${END}`)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      return isDefined(event.detail.value)
    }

    private handleChanged(event: EventChanged): void {
      const { propertyId } = this
      if (!propertyId) return

      const { detail: action } = event
      if (!action?.affects.includes(propertyId)) return

      this.setInputValue(this.scalar)
    }

    handleInput(): void {
      const { selectedProperty, input, propertyId } = this
      if (!(selectedProperty && input && propertyId)) return

      const { inputValue } = this
      const isEnd = propertyId.endsWith(END)
      if (isEnd || this.endValueDefined) {
        // console.debug(this.tagName, propertyId, 'handleInput END DEFINED')
        const event = new EventTimeRange()
        MOVIEMASHER.eventDispatcher.dispatch(event)
        const { detail: { timeRange } } = event
        if (timeRange) {
          const frame = isEnd ? timeRange.last : timeRange.frame
          // console.debug(this.tagName, propertyId, 'handleInput GOING', frame)
          MOVIEMASHER.eventDispatcher.dispatch(new EventChangeFrame(frame))
        }
      }
      // console.debug(this.tagName, this.propertyId, 'handleInput', inputValue)
      selectedProperty.value = inputValue

      MOVIEMASHER.eventDispatcher.dispatch(new EventChangeScalar(propertyId, inputValue))
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
      MOVIEMASHER.eventDispatcher.dispatch(event)
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
      MOVIEMASHER.eventDispatcher.dispatch(event)
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
          case ASSET_TARGET: {
            this.listeners[EventChangedAssetId.Type] = this.handleChangedAssetId.bind(this)
            break
          }
          case MASH: {
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
        case MASH: {
          const event = new EventMashAsset()
          MOVIEMASHER.eventDispatcher.dispatch(event)
          return event.detail.mashAsset?.id
        }
        case ASSET_TARGET: {
          const event = new EventAssetId()
          MOVIEMASHER.eventDispatcher.dispatch(event)
          return event.detail.assetId
        }
        default: {
          const event = new EventClipId()
          MOVIEMASHER.eventDispatcher.dispatch(event)
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

const AssetControlTag = 'movie-masher-control-asset'

const AssetWithControlProperty = ControlPropertyMixin(Component)
const AssetWithControl = ControlMixin(AssetWithControlProperty)
const AssetWithSizeReactive = SizeReactiveMixin(AssetWithControl)
const AssetWithDropTarget = DropTargetMixin(AssetWithSizeReactive)
/**
 * @category Component
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
    MOVIEMASHER.eventDispatcher.dispatch(event)
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
    if (!size) {
      console.log(this.tagName, this.propertyId, 'iconSize', 'no size')
      return
    }
    
    const max = this.variable('size-preview')
    const ratio = this.variable('ratio-preview')
    const contained = sizeContain(size, max * ratio)
    console.log(this.tagName, this.propertyId, 'iconSize', { contained, size, max, ratio })
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
  
  override handleDropped(event: DragEvent): void {
    const { dataTransfer } = event
    // console.log(this.tagName, this.propertyId, 'handleDropped', !!dataTransfer)
    assertDefined(dataTransfer)

    if (droppingFiles(dataTransfer)) {
      const promise = dropRawFiles(dataTransfer.files)
      if (promise) promise.then(assetObjects => {
        const [assetObject] = assetObjects
        if (!assetObject) return

        MOVIEMASHER.eventDispatcher.dispatch(new EventManagedAsset(assetObject))

        this.setInputValue(assetObject.id)
        // console.log(this.tagName, this.propertyId, 'handleDropped', assetObject)
      })
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
    const element = document.createElement(AssetControlTag)
    element.propertyId = propertyId
    return element
  }

  static handleNode(event: EventControl) {
    const { detail } = event
    const { type } = detail
    if (![CONTAINER_ID, CONTENT_ID].includes(type)) return
    
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

const BooleanControlTag = 'movie-masher-control-boolean'

const BooleanWithControlProperty = ControlPropertyMixin(Component)
const BooleanWithControl = ControlMixin(BooleanWithControlProperty)
/**
 * @category Component
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
    if (type !== BOOLEAN) return
    
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

const ControlInputTag = 'movie-masher-control-input'
const WithControlProperty = ControlPropertyMixin(Component)
/**
 * @category Component
 */
export class ControlInputElement extends WithControlProperty {
  private _control?: Node
  private get control(): Node | undefined {
    return this._control ||= this.controlInitialize
  }

  private get controlInitialize(): Node | undefined {
    const { dataType, propertyId } = this
    if (!propertyId) return

    const type = dataType || this.propertyDataType(propertyId)
    if (!type) {
      console.warn(this.tagName, 'controlInitialize', propertyId, 'no data type')
      return
    }

    const event = new EventControl(type, propertyId)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    return event.detail.control
  }

  dataType?: DataType

  protected override get defaultContent(): OptionalContent {
    const { selectedId } = this
    if (!isPopulatedString(selectedId)) {
      // console.warn(this.tagName, 'defaultContent', 'no selectedId')
      return
    }
    return this.control
  }

  private propertyDataType(propertyId: PropertyId): DataType | undefined {
    const event = new EventDataType(propertyId)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    return event.detail.dataType
  }

  protected override willUpdate(values: PropertyValues<this>): void {
    super.willUpdate(values)
    if (values.has('propertyId') || values.has('dataType')) this._control = undefined
  }

  static dataTypeDeclaration: PropertyDeclarations = {
    dataType: { type: String, attribute: 'data-type' },
  }

  static override properties: PropertyDeclarations = {
    ...ControlInputElement.dataTypeDeclaration,
    ...CONTROL_PROPERTY_DECLARATIONS,
  }

  static override styles: CSSResultGroup = [
    Component.cssHostFlex,
    Component.cssBorderBoxSizing,
  ]
}

customElements.define(ControlInputTag, ControlInputElement)

const ControlRowTag = 'movie-masher-control-row'
/**
 * @category Component
 */
export class ControlRowElement extends ImporterComponent {
  protected override content(contents: Contents): Content {
    return html`
      <div class='${ROW}'>${contents}</div>
    `
  }

  dataType?: DataType

  private get icon(): DataType | undefined {
    const { propertyId } = this
    if (!propertyId) return
    const name = propertyId.split(DOT).pop() 
    if (!name) return

    if (name.endsWith(END)) return name.slice(0, -END.length)
    
    if (name.endsWith('Id')) return name.slice(0, -2)

    return name
  }

  protected override get defaultContent(): OptionalContent {
    const { icon, propertyId, dataType } = this
    if (!(icon && propertyId)) return

    this.importTags('movie-masher-component-icon')
    return html`
      <movie-masher-component-icon icon='${icon}'></movie-masher-component-icon>
      <movie-masher-control-input
        data-type='${dataType || nothing}' property-id='${propertyId}'
      ></movie-masher-control-input>
    `
  }

  propertyId?: PropertyId

  static override properties: PropertyDeclarations = {
    propertyId: { type: String, attribute: 'property-id' },
    ...ControlInputElement.dataTypeDeclaration,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        display: flex;
        /* height: min-content; */
        line-height: var(--height-control);
        font-size: var(--height-control);
        margin-bottom: var(--spacing);
      }
      div.row {
        flex-grow: 1;
        display: grid;
        gap: var(--gap-control);
        grid-template-columns: min-content 1fr;
      }
    `,
  ]
}

customElements.define(ControlRowTag, ControlRowElement)

const NumericControlTag = 'movie-masher-control-numeric'

const NumericWithControlProperty = ControlPropertyMixin(Component)
const NumericWithControl = ControlMixin(NumericWithControlProperty)
/**
 * @category Component
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
        type='${type === PERCENT ? 'range' : 'number'}'
        name='${name}' 
        aria-label='${name}'
        max='${max || ''}'
        min='${min || ''}'
        step='${step || ''}'
        value='${value || ''}'
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

  private static types = [FRAME, NUMBER, PERCENT]
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

const RgbControlTag = 'movie-masher-control-rgb'

const RgbWithControlProperty = ControlPropertyMixin(Component)
const RgbWithControl = ControlMixin(RgbWithControlProperty)
/**
 * @category Component
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
    if (type !== RGB) return
    
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
MOVIEMASHER.eventDispatcher.addDispatchListener(EventControl.Type, RgbControlElement.handleNode)

// listen for control rgb event
export const ClientControlRgbListeners: ListenersFunction = () => ({
  [EventControl.Type]: RgbControlElement.handleNode
})



const StringControlTag = 'movie-masher-control-string'

const StringWithControlProperty = ControlPropertyMixin(Component)
const StringWithControl = ControlMixin(StringWithControlProperty)
/**
 * @category Component
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
    if (type !== STRING) return
    
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


const AspectControlGroupTag = 'movie-masher-control-group-aspect'

const AspectWithControlGroup = ControlGroupMixin(ImporterComponent)
/**
 * @category Component
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

    this.importTags('movie-masher-action-client')
    this.importTags('movie-masher-component-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-component-icon icon='aspect'></movie-masher-component-icon>
        </legend>
        <div>
          <movie-masher-component-icon icon='${icon}'></movie-masher-component-icon>
          ${this.controlInputContent(aspectWidthId)}
          /
          ${this.controlInputContent(aspectHeightId)}
          <movie-masher-action-client 
            icon='${FLIP}' detail='${FLIP}'
          ></movie-masher-action-client>
        </div>
        <div>
          <movie-masher-component-icon icon='aspectShortest'></movie-masher-component-icon>
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

const DimensionsControlGroupTag = 'movie-masher-control-group-dimensions'

const WithControlGroup = ControlGroupMixin(ImporterComponent)
const WithSizeReactive = SizeReactiveMixin(WithControlGroup)
/**
 * @category Component
 */
export class DimensionsControlGroupElement extends WithSizeReactive implements ControlGroup {
  override connectedCallback(): void {
    const heightId = this.namePropertyId(`height${END}`)
    if (heightId) {
      const [target] = heightId.split(DOT)
      const key = `control-group-${target}-height`
      this.listeners[key] = this.handleHeight.bind(this)
    }

    const widthId = this.namePropertyId(`width${END}`)
    if (widthId) {
      const [target] = widthId.split(DOT)
      const key = `control-group-${target}-width`
      this.listeners[key] = this.handleWidth.bind(this)
    }
    super.connectedCallback()
  }

  protected override get defaultContent(): OptionalContent {
    const { propertyIds, size } = this
    if (!(size && propertyIds?.length)) return


    const aspectFlip = this.propertyIdValue(`size${ASPECT}`) === FLIP
    const portrait = size.height > size.width
    const aspectIcon = portrait ? 'landscape' : 'portrait' 

    this.importTags('movie-masher-component-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-component-icon icon='size'></movie-masher-component-icon>
        </legend>
        ${this.propertyNameContent('lock')}
        ${this.dimensionsContent(aspectFlip, portrait)}
        ${this.controlContent(`size${ASPECT}`, aspectIcon)}
      </fieldset>
    `
  }

  private dimensionsContent(aspectFlip: boolean, portrait: boolean): Contents {
    const contents: Contents = []
    const flipped = aspectFlip && portrait
    const widthIcon = flipped ? HEIGHT : WIDTH
    const heightIcon = flipped ? WIDTH : HEIGHT
    // const lock = this.propertyIdValue('lock')
    const use: BooleanRecord = { width: true, height: true }
    // if (lock) {
    //   switch(lock) {
    //     case NONE: break
    //     case WIDTH: {
    //       // use.height = false
    //       break
    //     }
    //     case HEIGHT: {
    //       // use.width = false
    //       break
    //     }
    //     default: {
         
    //       if (lock === LONGEST) {
    //         use[flipped ? HEIGHT : WIDTH] = false
    //       } else use[!flipped ? HEIGHT : WIDTH] = false
            
    //     }
    //   }
    // }
    
    if (use.width) {
      const widthContent = this.controlContent(WIDTH, widthIcon)
      if (widthContent) contents.push(widthContent)
    }
    if (use.height) {
      const heightContent = this.controlContent(HEIGHT, heightIcon)
      if (heightContent) contents.push(heightContent)
    }
    return contents
  }

  protected handleHeight(event: StringEvent) {
    event.stopImmediatePropagation()
    this.addOrRemoveEnd(event.detail, HEIGHT)
  }
 
  protected handleWidth(event: StringEvent) {
    event.stopImmediatePropagation()
    this.addOrRemoveEnd(event.detail, WIDTH)
  }

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

  static instance(propertyIds: PropertyIds) {
    const element = document.createElement(DimensionsControlGroupTag)
    element.propertyIds = propertyIds
    return element
  }

  private static names: Strings = [
    ...SIZE_KEYS.flatMap(key => [key, `${key}${END}`]),
    'lock', `size${ASPECT}`,
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

const FillControlGroupTag = 'movie-masher-control-group-fill'

const FillWithControlGroup = ControlGroupMixin(ImporterComponent)
/**
 * @category Component
 */
export class FillControlGroupElement extends FillWithControlGroup implements ControlGroup {
  override connectedCallback(): void {
    const { propertyIds } = this
    if (!propertyIds?.length) return
    
    const colorId = this.namePropertyId(`color${END}`)
    if (colorId) {
      const [target] = colorId.split(DOT)
      const key = `control-group-${target}-color`     
      this.listeners[key] = this.handleColor.bind(this)
    }
    const opacityId = this.namePropertyId(`opacity${END}`)
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

    this.importTags('movie-masher-component-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-component-icon icon='visible'></movie-masher-component-icon>
        </legend>
        ${this.controlContent('color')}
        ${this.controlContent('opacity')}
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
    this.addOrRemoveEnd(event.detail, 'opacity')
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
    'color', 'colorEnd', 'opacity', 'opacityEnd'
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

const LocationControlGroupTag = 'movie-masher-control-group-location'
const EventLocationControlGroupType = 'point-control-group'

const LocationWithControlGroup = ControlGroupMixin(ImporterComponent)
const LocationWithSizeReactive = SizeReactiveMixin(LocationWithControlGroup)
const LocationFlippedProperties = {
  [TOP]: LEFT,
  [BOTTOM]: RIGHT,
  [LEFT]: TOP,
  [RIGHT]: BOTTOM
}

/**
 * @category Component
 */
export class LocationControlGroupElement extends LocationWithSizeReactive implements ControlGroup {
  constructor() {
    super()
    this.listeners[EventLocationControlGroupType] = this.handleDirection.bind(this)
  }

  override connectedCallback(): void {
    const xId = this.namePropertyId(`x${END}`)
    if (xId) {
      const [target] = xId.split(DOT)
      const key = `control-group-${target}-x`     
      this.listeners[key] = this.handleX.bind(this)
    }
    const yId = this.namePropertyId(`y${END}`)
    if (yId) {
      const [target] = yId.split(DOT)
      const key = `control-group-${target}-y`     
      this.listeners[key] = this.handleY.bind(this)
    }
    super.connectedCallback()
  }

  private constrainedContent(flipped: boolean): OptionalContent {
    this.importTags('movie-masher-component-a')
    const contents: Contents = DIRECTIONS_SIDE.flatMap(direction => {
      const propertyName = `${direction}${CROP}`
      const propertyId = this.namePropertyId(propertyName)
      if (!propertyId) return []

      const value = this.propertyIdValue(propertyId)
      const icon = flipped ? LocationFlippedProperties[direction] : direction
      return [html`
        <movie-masher-component-a
          emit='${EventLocationControlGroupType}' detail='${direction}'
          icon='${icon}' 
          selected='${value || nothing}'
        ></movie-masher-component-a>
      `]
    })
    if (!contents.length) return

    this.importTags('movie-masher-component-icon')
    return html`
      <div>
        <movie-masher-component-icon icon='crop'></movie-masher-component-icon>
        ${contents}
      </div>
    `
  }

  protected override get defaultContent(): OptionalContent {
    const { propertyIds, size } = this
    if (!(size && propertyIds?.length)) return

    const aspectFlip = this.propertyIdValue(`point${ASPECT}`) === FLIP
    const portrait = size.height > size.width
    const aspectIcon = portrait ? 'landscape' : 'portrait' 
    const xIcon = portrait && aspectFlip ? 'y' : 'x'
    const yIcon = portrait && aspectFlip ? 'x' : 'y'
    
    this.importTags('movie-masher-component-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-component-icon icon='point'></movie-masher-component-icon>
        </legend>
        ${this.controlContent('x', xIcon)}
        ${this.controlContent('y', yIcon)}
        ${this.constrainedContent(portrait && aspectFlip)}
        ${this.controlContent(`point${ASPECT}`, aspectIcon)}
      </fieldset>
    `
  }
  
  private handleDirection(event: StringEvent) {
    const { detail: direction } = event
    const propertyName = `${direction}${CROP}`
    const propertyId = this.namePropertyId(propertyName)
    if (!propertyId) return
    
    const scalar = this.propertyIdValue(propertyId)
    MOVIEMASHER.eventDispatcher.dispatch(new EventChangeScalar(propertyId, !scalar))
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
    ...DIRECTIONS_SIDE.map(direction => `${direction}${CROP}`),
    ...POINT_KEYS.flatMap(key => ([key, `${key}${END}`])),
    `point${ASPECT}`,
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

const TimeControlGroupTag = 'movie-masher-control-group-time'

const TimeWithControlGroup = ControlGroupMixin(ImporterComponent)
/**
 * @category Component
 */
export class TimeControlGroupElement extends TimeWithControlGroup implements ControlGroup {
  private get framedContent(): OptionalContent {
    const htmls: Contents = []
    const frameId = this.namePropertyId(FRAME)
    const framesId = this.namePropertyId('frames')
    const frameInput = this.controlInputContent(frameId)
    if (frameInput) htmls.push(html`
      <movie-masher-component-icon icon='frame'></movie-masher-component-icon>
      ${frameInput}
    `)
    const framesInput = this.controlInputContent(framesId)
    if (framesInput) htmls.push(html`
      <movie-masher-component-icon icon='frames'></movie-masher-component-icon>
      ${framesInput}
    `)
    if (!htmls.length) return

    return html`<div>${htmls}</div>`
  }

  protected override get defaultContent(): OptionalContent {
    const { propertyIds } = this
    if (!propertyIds?.length) return

    this.importTags('movie-masher-component-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-component-icon icon='timeline'></movie-masher-component-icon>
        </legend>
        ${this.controlContent('timing')}
        ${this.framedContent}
      </fieldset>
    `
  }

  static handleControlGroup(event: EventControlGroup) {
    const { detail } = event
    const { propertyIds, groupedPropertyIds } = detail
    const remainingIds = propertyIds.filter(id => 
      !groupedPropertyIds.includes(id)
    )
    const { names } = TimeControlGroupElement
    const foundIds = remainingIds.filter(id => names.some(name => id.endsWith(`${DOT}${name}`)))
    if (foundIds.length) {
      // console.log('TimeControlGroupElement.handleControlGroup', propertyIds, remainingIds, foundIds, names)
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

  private static names: Strings = [FRAME, 'frames', 'timing']

  static override properties: PropertyDeclarations = {
    ...CONTROL_GROUP_DECLARATIONS,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    CONTROL_GROUP_CSS,
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
