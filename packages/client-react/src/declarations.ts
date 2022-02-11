import React from 'react'
import {
  DataType, Definition, DefinitionObject, EventType, JsonObject, StringSetter, TrackType, UnknownObject
} from '@moviemasher/moviemasher.js'


// TODO: determine if we really need to repeat this
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

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

export type UnknownElement = React.ReactElement<UnknownObject>

export interface EditorIcons {
  [key: string]: UnknownElement
}

export type EditorInputs = {
  [key in DataType]: UnknownElement
}

export interface DefinitionsPromise extends Promise<Definition[]> {}
export interface SourceCallbackOptions extends UnknownObject {
  page?: number
  perPage?: number
  terms?: string
}

/**
 * @category Callback
 */
export interface SourceCallback {
 (options?: SourceCallbackOptions): DefinitionsPromise
}
/**
 * @category Callback
 */
export interface ListenerCallback { (): void }
export interface ListenerEvents extends Partial<Record<EventType, ListenerCallback>> {}

/**
 * must be a single element
 */
export interface PropsAndChild extends UnknownObject {
  /**
   * @required
   */
  children: React.ReactElement<UnknownObject>
}

export interface PropsWithoutChild extends UnknownObject {
  children?: never
}

export interface PropsWithChildren extends UnknownObject {
  children?: React.ReactNode
}

export interface PropsAndChildren extends UnknownObject {
  children: React.ReactNode
}
export type ReactResult = React.ReactElement<any, any> | null

export type PropsMethod<I, O> = (input: I) => O

export interface WithClassName extends UnknownObject {
  className?: string
}
