import type { EventChangedMashAsset, MashIndex, SelectedProperty } from '@moviemasher/runtime-client'
import type { AssetObject, AssetType, DataType, Identified, Property, PropertyId, PropertyIds, Rect, Scalar, Size, TargetId } from '@moviemasher/runtime-shared'
import type { TemplateResult } from 'lit'

export type Constructor<T> = new (...args: any[]) => T

export type Html = TemplateResult<1> 
export type Htmls = Html[]

export type Content = Html | Node | Scalar 
export type Contents = Content[]
export type OptionalContent = Content | void

export type Nodes = Node[]
export type Elements = Element[]

export interface ConnectionEventDetail {
  connected: boolean
  handled?: boolean
}

export type ConnectionEvent = CustomEvent<ConnectionEventDetail>


export type AssetTypeEvent = CustomEvent<AssetType>


export interface AssetObjectFromIdEventDetail extends Identified {
  assetObject?: AssetObject
}

export type AssetObjectFromIdEvent = CustomEvent<AssetObjectFromIdEventDetail>



export interface DropTarget {
  acceptsClip: boolean
  handleDragged(): void
  handleDropped(event: DragEvent): void 
  dropValid(dataTransfer: DataTransfer | null): boolean
  mashIndex(event: DragEvent): MashIndex
  ondragenter(event: DragEvent): void 
  ondragleave(event: DragEvent): void 
  ondragover(event: DragEvent): void 
  ondrop(event: DragEvent): void
}

export interface Disablable {
  disabled: boolean
  handleChangedMashAsset(event: EventChangedMashAsset): void
}


export interface RectObserver {
  handleResize(): void
  rect?: Rect
}

export interface ControlGroup {
  addOrRemoveEnd(addOrRemove: string, propertyNamePrefix: string): void
  controlContent(name: string, icon?: string): OptionalContent 
  controlInputContent(propertyId?: PropertyId, dataType?: DataType): OptionalContent
  controlInputContentEnd(namePrefix: string): OptionalContent
  currentValue(name: string, addOrRemove: string): Scalar | undefined 
  namePropertyId(name: string): PropertyId | undefined
  propertyIds?: PropertyIds
  propertyIdValue(nameOrPropertyId: string): Scalar | undefined 
  propertyNameContent(propertyName: string): OptionalContent
  selectedProperty(propertyId: PropertyId): SelectedProperty | undefined
}

export type ControlInput = HTMLInputElement | HTMLSelectElement

export interface Control extends ControlProperty {
  setInputValue(value?: Scalar): boolean 
  input?: ControlInput
  handleInput(): void
  inputSelectContent: OptionalContent
  endValueDefined: boolean 
  inputValue?: Scalar 
  property?: Property 
  scalar?: Scalar
}

export interface ControlProperty {
  propertyId?: PropertyId
  selectedId?: string
  targetId?: TargetId
}


export interface SizeReactive {
  size?: Size
}