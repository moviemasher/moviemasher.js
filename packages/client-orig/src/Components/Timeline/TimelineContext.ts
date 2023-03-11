import {
  EmptyFunction,RectZero,
  Clip, DroppingPosition, NumberSetter, Rect, Track, EmptyFunctionType, Point
} from '@moviemasher/moviemasher.js'
import { createContext } from '../../Framework/FrameworkFunctions'

export interface TimelineContextInterface {
  dragTypeValid(dataTransfer: DataTransfer, clip?: Clip): boolean
  droppingClip?: Clip
  droppingPosition?: DroppingPosition | number
  droppingTrack?: Track
  frame: number
  frames: number
  onDragLeave: (event: DragEvent) => void
  onDrop: (event: DragEvent) => void
  rect: Rect
  refresh: EmptyFunctionType
  refreshed: number
  scale: number
  scroll: Point
  selectedClip?: Clip
  selectedTrack?: Track
  setDroppingClip(_?: Clip): void
  setDroppingPosition(_: DroppingPosition | number): void
  setDroppingTrack(_?: Track): void
  setRect(_:Rect): void
  setScroll(_:Point): void
  setZoom: NumberSetter
  zoom: number
}

export const TimelineContextDefault: TimelineContextInterface = {
  dragTypeValid(): boolean { return false },
  frame: 0,
  frames: 0,
  onDragLeave: EmptyFunction,
  onDrop: EmptyFunction,
  rect: RectZero,
  refreshed: 0, refresh: EmptyFunction,
  scale: 0,
  scroll: { x: 0, y: 0 },
  setDroppingClip: EmptyFunction,
  setDroppingPosition: EmptyFunction,
  setDroppingTrack: EmptyFunction,
  setRect: EmptyFunction,
  setScroll: EmptyFunction,
  setZoom: EmptyFunction,
  zoom: 1,
}

export const TimelineContext = createContext(TimelineContextDefault)
