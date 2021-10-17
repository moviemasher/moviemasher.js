import { DefinitionType, TrackType } from '@moviemasher/moviemasher.js'

import { DropTargetMonitor } from 'react-dnd'

export type UnknownChangeEvent = React.ChangeEvent<{}>
export type SliderChangeHandler = (event: UnknownChangeEvent, value: number | number[]) => void
export type NodeObject = Exclude<React.ReactNode, boolean | null | undefined>
export type NodesArray = Array<NodeObject>

export interface DragClipObject {
  type: DefinitionType
}
export interface DropClipsResult {
  index: number
  pixels: number
  type: TrackType
}

export interface DragClipProps {
  isDragging: boolean
}
export interface DropClipsProps {
  isOver: boolean
}

export type DropClipsMonitor = DropTargetMonitor<DragClipObject, DropClipsResult>
