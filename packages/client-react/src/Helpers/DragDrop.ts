import {
  DefinitionObject, UnknownObject, TrackType, MashAndDefinitionsObject,
  Clip, Effect, Layer, Point, isString, Rect, isObject, isDefinitionType, DefinitionType
} from "@moviemasher/moviemasher.js"
import React from "react"


export interface DragClipObject {
  offset: number
}

export const isDragClipObject = (value: any): value is DragClipObject => {
  return isObject(value) && "offset" in value
}
export interface DragDefinitionObject extends DragClipObject {
  definitionObject: DefinitionObject
}

export const isDragDefinitionObject = (value: any): value is DragDefinitionObject => {
  return isDragClipObject(value) && "definitionObject" in value
}

export interface DragLayerObject extends UnknownObject {
  offset: number
  mashAndDefinitions?: MashAndDefinitionsObject
}

export interface DragEffectObject extends UnknownObject {
  index: number
  definitionObject?: DefinitionObject
}

export type Draggable = MashAndDefinitionsObject | Clip | Effect | Layer

export enum DragType {
  Mash = 'mash',
  Layer = 'layer',
  Track = 'track',
}

export const DragTypes = Object.values(DragType)
export const isDragType = (value: any): value is DragType => (
  isString(value) && DragTypes.includes(value as DragType)
)


export const dragType = (dataTransfer: DataTransfer): DragType | DefinitionType | undefined => {
  const prefix = dataTransfer.types.find(type => type.endsWith(DragSuffix))
  if (!prefix) return

  const [type] = prefix.split('/')
  if (isDragType(type) || isDefinitionType(type)) return type
}

export const DragElementRect = (current: Element): Rect => current.getBoundingClientRect()

export const DragElementPoint = (event: React.DragEvent, current: Element | Rect,): Point => {
  const rect = (current instanceof Element) ? DragElementRect(current) : current
  const { x, y } = rect
  const { clientY, clientX } = event
  return { x: clientX - x, y: clientY - y }
}


export const DragSuffix = '/x-moviemasher'
