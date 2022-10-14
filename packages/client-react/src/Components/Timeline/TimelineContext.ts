import React from 'react'
import {
  EmptyMethod,RectZero,
  Clip, DroppingPosition, NumberSetter, Rect, Track, VoidMethod, Point
} from '@moviemasher/moviemasher.js'

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
  refresh: VoidMethod
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
  onDragLeave: EmptyMethod,
  onDrop: EmptyMethod,
  rect: RectZero,
  refreshed: 0, refresh: EmptyMethod,
  scale: 0,
  scroll: { x: 0, y: 0 },
  setDroppingClip: EmptyMethod,
  setDroppingPosition: EmptyMethod,
  setDroppingTrack: EmptyMethod,
  setRect: EmptyMethod,
  setScroll: EmptyMethod,
  setZoom: EmptyMethod,
  zoom: 1,
}

export const TimelineContext = React.createContext(TimelineContextDefault)
