import React from 'react'
import {
  DataType, Definition, DefinitionObject, EventType, Masher, TrackType, UnknownObject
} from '@moviemasher/moviemasher.js'

export type UnknownChangeEvent = React.ChangeEvent<{}>
export type SliderChangeHandler = (event: UnknownChangeEvent, value: number | number[]) => void
export type NodeObject = Exclude<React.ReactNode, boolean | null | undefined>
export type NodesArray = Array<NodeObject>

export interface DragClipObject extends UnknownObject {
  offset: number
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

export type Panel = React.FunctionComponent<React.PropsWithChildren<UnknownObject>>

export type UnknownElement = React.ReactElement<UnknownObject>
export type EditorIcons = {
  [key: string]: UnknownElement
}

export type EditorInputs = {
  [key in DataType]: UnknownElement
}

export type DefinitionsPromise = Promise<Definition[]>
export interface SourceCallbackOptions extends UnknownObject {
  page?: number
  perPage?: number
  terms?: string
}
export type SourceCallback = (options?:SourceCallbackOptions) => DefinitionsPromise

export type ListenerCallback = (masher: Masher) => void
export type ListenerEvents = Partial<Record<EventType, ListenerCallback>>
