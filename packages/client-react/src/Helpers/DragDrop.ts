import { DefinitionObject, UnknownObject, TrackType } from "@moviemasher/moviemasher.js"

export interface DragClipObject extends UnknownObject {
  offset: number
  definition?: DefinitionObject
}

export interface DragEffectObject extends UnknownObject {
  index: number
  definition?: DefinitionObject
}
export interface DropClipsResult {
  index: number
  pixels: number
  type: TrackType
}

export interface DragClipProps {
  isDragging: boolean
  initialSourceClientOffset: number
}
export interface DropClipsProps {
  isOver: boolean
}
