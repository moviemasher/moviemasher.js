import {
  DefinitionObject, UnknownObject, MashAndDefinitionsObject,
  Clip, Effect, Layer, Point, isString, Rect, isObject, isDefinitionType, 
  DefinitionType, assertDefinitionType, StringsObject, NumberObject, 
  JsonObject, isUploadType, isAboveZero, isPopulatedString, isArray, 
  DroppingPosition, isUndefined, ClassDropping, ClassDroppingAfter, 
  ClassDroppingBefore, isPopulatedObject, throwError
} from "@moviemasher/moviemasher.js"
import React from "react"


export const DragSuffix = '/x-moviemasher'

export type FileInfo = File | UnknownObject
export type FileInfos = FileInfo[]

export interface DragOffsetObject {
  offset: number
}
export const isDragOffsetObject = (value: any): value is DragOffsetObject => {
  return isObject(value) && "offset" in value
}
export function assertDragOffsetObject(value: any): asserts value is DragOffsetObject {
  if (!isDragOffsetObject(value)) throwError(value, 'DragOffsetObject')
}

export interface DragDefinitionObject extends DragOffsetObject {
  definitionObject: DefinitionObject
}
export const isDragDefinitionObject = (value: any): value is DragDefinitionObject => {
  return isDragOffsetObject(value) && "definitionObject" in value
}
export function assertDragDefinitionObject(value: any): asserts value is DragDefinitionObject {
  if (!isDragDefinitionObject(value)) throwError(value, 'DragDefinitionObject')
}

export interface DragLayerObject extends UnknownObject {
  offset: number
  mashAndDefinitions?: MashAndDefinitionsObject
}

export interface DragEffectObject extends UnknownObject {
  index: number
  definitionObject?: DefinitionObject
}

export type Draggable = DefinitionObject | MashAndDefinitionsObject | Clip | Effect | Layer | FileList

export enum DragType {
  Mash = 'mash',
  Layer = 'layer',
  Track = 'track',
}

export const DragTypes = Object.values(DragType)
export const isDragType = (value: any): value is DragType => (
  isString(value) && DragTypes.includes(value as DragType)
)

export const TransferTypeFiles = "Files"
export type TransferType = string 
export const isTransferType = (value: any): value is TransferType => {
  return isString(value) && value.endsWith(DragSuffix)
}
// 
export const dropType = (dataTransfer?: DataTransfer | null): TransferType | undefined => {
  if (!dataTransfer) return
  
  return dataTransfer.types.find(isTransferType)
}

export const dragDefinitionType = (transferType: TransferType): DefinitionType => {
  const [type] = transferType.split('/')
  assertDefinitionType(type)
  return type
}

export const dragType = (dataTransfer?: DataTransfer | null): DragType | DefinitionType | undefined => {
  const prefix = dropType(dataTransfer)
  if (!prefix) return

  const [type] = prefix.split('/')
  if (isDragType(type) || isDefinitionType(type)) return type
}

export const dragTypes = (dataTransfer: DataTransfer): string[] => {
  const { types } = dataTransfer
  return types.filter(type => (
    type === TransferTypeFiles || isTransferType(type)
  ))
}

export const dragData = (dataTransfer: DataTransfer, type?: TransferType) => {
  const transferType = type ? `${type}${DragSuffix}` : dragTypes(dataTransfer).find(isTransferType)
  if (!transferType) return {}

  const json = dataTransfer.getData(transferType)
  // console.log("dragData", json, type, transferType)
  const data = json ? JSON.parse(json) : {}
  return data
}

export const DragElementRect = (current: Element): Rect => current.getBoundingClientRect()

export const DragElementPoint = (event: DragEvent, current: Element | Rect,): Point => {
  const rect = (current instanceof Element) ? DragElementRect(current) : current
  const { x, y } = rect
  const { clientY, clientX } = event
  return { x: clientX - x, y: clientY - y }
}

export const dropFilesFromList = (files: FileList, serverOptions: JsonObject = {}): FileInfos => {
  const infos: FileInfos = []
  const { length } = files
  if (!length) return infos

  const exists = isPopulatedObject(serverOptions)
  const { extensions = {}, uploadLimits = {} } = serverOptions
  const extensionsByType = extensions as StringsObject
  const limitsByType = uploadLimits as NumberObject

  for (let i = 0; i < length; i++) {
    const file = files.item(i)
    if (!file) continue

    const { name, size, type } = file
    const coreType = type.split('/').shift()
    if (!isUploadType(coreType)) {
      infos.push({ label: name, value: coreType, error: 'import.type' })
      continue
    }
    
    const max = limitsByType[coreType]
    if (exists && !(isAboveZero(max) && max * 1024 * 1024 > size)) {
      infos.push({ label: name, value: `${max}MB`, error: 'import.bytes' })
      continue
    }

    const ext = name.toLowerCase().split('.').pop()
    const extDefined = isPopulatedString(ext)
    const exts = extensionsByType[coreType]
    if (exists || !extDefined) {
      if (!(extDefined && isArray(exts) && exts.includes(ext))) {
        infos.push({ label: name, value: ext, error: 'import.extension' })
        continue
      } 
    }
    infos.push(file)
  }
  return infos
}


export const droppingPositionClass = (droppingPosition?: DroppingPosition | number): string => {
  if (isUndefined(droppingPosition)) return ''

  switch (droppingPosition) {
    case DroppingPosition.After: return ClassDroppingAfter
    case DroppingPosition.Before: return ClassDroppingBefore
    case DroppingPosition.None: return ''
  }
  return ClassDropping
}
