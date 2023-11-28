import type { PropertyId, Rect, Size, TargetId } from '@moviemasher/runtime-shared'
import type { ClipLocation } from './Masher.js'
import type { EventChangedMashAsset } from './ClientEvents.js'

export interface Nodes extends Array<Node>{}
export interface Elements extends Array<Element>{}

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

export type ControlInput = HTMLInputElement | HTMLSelectElement

export interface ControlProperty {
  propertyId?: PropertyId
  selectedId?: string
  targetId?: TargetId
}

export interface SizeReactive {
  size?: Size
}
