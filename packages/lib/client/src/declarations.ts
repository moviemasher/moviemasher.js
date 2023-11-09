import type { EventChangedMashAsset, ClipLocation, SelectedProperty } from '@moviemasher/runtime-client'
import type { AssetObject, AssetType, DataType, Identified, Property, PropertyId, PropertyIds, Rect, Scalar, Size, TargetId } from '@moviemasher/runtime-shared'
import type { TemplateResult } from 'lit'

export type Html = TemplateResult<1> 
export interface Htmls extends Array<Html>{}

export type Content = Html | Node | Scalar 
export interface Contents extends Array<Content>{}
export type OptionalContent = Content | void

export interface Nodes extends Array<Node>{}
export interface Elements extends Array<Element>{}

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
  mashIndex(event: DragEvent): ClipLocation | undefined
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
  currentValue(name: string): Scalar | undefined 
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