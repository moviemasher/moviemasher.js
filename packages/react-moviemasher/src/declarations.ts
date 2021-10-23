
import { TrackType } from '@moviemasher/moviemasher.js'

export type UnknownChangeEvent = React.ChangeEvent<{}>
export type SliderChangeHandler = (event: UnknownChangeEvent, value: number | number[]) => void
export type NodeObject = Exclude<React.ReactNode, boolean | null | undefined>
export type NodesArray = Array<NodeObject>

export interface DragClipObject {
  offset: number
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
