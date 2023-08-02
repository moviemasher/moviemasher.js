import type { EventChangedMashAsset, MashIndex, SelectedProperty } from '@moviemasher/runtime-client'
import type { AssetObject, AssetObjects, AssetType, DataOrError, DataType, Identified, Importers, PropertyId, PropertyIds, Rect, Scalar, Size, StringRecord, Strings, TargetId } from '@moviemasher/runtime-shared'
import type { TemplateResult } from 'lit'

// TODO: remove these
export type CoreLib = typeof import('@moviemasher/lib-shared')
export type HeaderSectionSlot = 'header'
export type FooterSectionSlot = 'footer'
export type DivSectionSlot = 'div'
export type SectionSlot = HeaderSectionSlot | FooterSectionSlot | DivSectionSlot
export type LeftSlot = 'left'
export type RightSlot = 'right'
export type CenterSlot = 'center'
export type IconSlot = 'icon'
export type StringSlot = 'string'

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

export interface AssetObjectsEventDetail extends AssetObjectsParams {
  promise?: Promise<DataOrError<AssetObjects>>
}

export type AssetObjectsEvent = CustomEvent<AssetObjectsEventDetail>

export interface AssetObjectFromIdEventDetail extends Identified {
  assetObject?: AssetObject
}

export type AssetObjectFromIdEvent = CustomEvent<AssetObjectFromIdEventDetail>


export interface AssetObjectPromiseEventDetail {
  promise?: Promise<DataOrError<AssetObject>>
}
export type AssetObjectPromiseEvent = CustomEvent<AssetObjectPromiseEventDetail>


export interface ImportEventDetail {
  fileList: FileList
  promise?: Promise<AssetObjects>
}

export type ImportEvent = CustomEvent<ImportEventDetail>

export interface ImportAssetObjectsEventDetail {
  assetObjects: AssetObjects
}
export type ImportAssetObjectsEvent = CustomEvent<ImportAssetObjectsEventDetail>

export interface AssetObjectsParams extends ClientReadParams {
  excludeImported?: boolean
  excludeMash?: boolean
  excludeSource?: boolean
}

export interface ClientReadParams {
  type: AssetType 
  kind?: string | Strings
  order?: string | StringRecord
  terms?: string
}

export interface ImportersEventDetail {
  importers: Importers
}

export interface DropTarget {
  acceptsClip: boolean
  handleDragged(): void
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
  selectedProperty?: SelectedProperty
  setInputValue(value?: Scalar): void 
  input?: ControlInput
  handleInput(): void
  inputSelectContent: OptionalContent
  endValueDefined: boolean 
  inputValue?: Scalar 
}

export interface ControlProperty {
  propertyId?: PropertyId
  selectedId?: string
  targetId?: TargetId
}


export interface SizeReactive {
  size?: Size
}