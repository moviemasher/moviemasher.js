import React from 'react'
import {
  EmptyRect, EmptyMethod,
  Clip, DefinitionType, DroppingPosition, NumberSetter, Rect, Track, VoidMethod, Point
} from '@moviemasher/moviemasher.js'


export interface TimelineContextInterface {
  dragTypeValid(dataTransfer: DataTransfer, track?: Track): DefinitionType | undefined
  droppingClip?: Clip
  droppingPosition?: DroppingPosition | number
  droppingTrack?: Track
  onDragLeave: VoidMethod
  onDrop: React.DragEventHandler
  rect: Rect
  refreshed: number
  refresh: VoidMethod
  scale: number
  selectedClip?: Clip
  selectedTrack?: Track
  setDroppingClip(_?: Clip): void
  setDroppingPosition(_: DroppingPosition | number): void
  setDroppingTrack(_?: Track): void
  setRect(_:Rect): void
  setScroll(_:Point): void
  setZoom: NumberSetter
  zoom: number
  scroll: Point
}

export const TimelineContextDefault: TimelineContextInterface = {
  dragTypeValid(): DefinitionType | undefined { return },
  onDragLeave: EmptyMethod,
  onDrop: EmptyMethod,
  rect: EmptyRect,
  scale: 0,
  setDroppingClip: EmptyMethod,
  setDroppingPosition: EmptyMethod,
  setDroppingTrack: EmptyMethod,
  setRect: EmptyMethod,
  setScroll: EmptyMethod,
  setZoom: EmptyMethod,
  zoom: 1,
  scroll: { x: 0, y: 0 },
  refreshed: 0, refresh: EmptyMethod,
}

export const TimelineContext = React.createContext(TimelineContextDefault)
