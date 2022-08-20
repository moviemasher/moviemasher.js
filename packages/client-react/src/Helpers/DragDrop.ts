import {
  DefinitionObject, UnknownObject, MashAndDefinitionsObject,
  Clip, Effect, Layer, Point, isString, Rect, isObject, isDefinitionType, DefinitionType, PopulatedString, assertDefinitionType, ActivityInfo, ObjectUnknown, assertObject, StringsObject, NumberObject, JsonObject, isUploadType, isAboveZero, isPopulatedString, isArray, DroppingPosition, isUndefined, ClassDropping, ClassDroppingAfter, ClassDroppingBefore
} from "@moviemasher/moviemasher.js"
import React from "react"


export const DragSuffix = '/x-moviemasher'

export type FileInfo = File | UnknownObject
export type FileInfos = FileInfo[]

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

export const TransferTypeFiles = "Files"
export type TransferType = string 
export const isTransferType = (value: any): value is TransferType => {
  return isString(value) && value.endsWith(DragSuffix)
}
// 
export const dropType = (dataTransfer: DataTransfer): TransferType | undefined => {
  return dataTransfer.types.find(isTransferType)
}

export const dragDefinitionType = (transferType: TransferType): DefinitionType => {
  const [type] = transferType.split('/')
  assertDefinitionType(type)
  return type
}

export const dragType = (dataTransfer: DataTransfer): DragType | DefinitionType | undefined => {
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
  const transferType = type || dragTypes(dataTransfer).find(isTransferType)
  if (!transferType) return {}

  const json = dataTransfer.getData(transferType)
  const data = JSON.parse(json)
  return data
}

export const DragElementRect = (current: Element): Rect => current.getBoundingClientRect()

export const DragElementPoint = (event: React.DragEvent, current: Element | Rect,): Point => {
  const rect = (current instanceof Element) ? DragElementRect(current) : current
  const { x, y } = rect
  const { clientY, clientX } = event
  return { x: clientX - x, y: clientY - y }
}

export const dropFilesFromList = (files: FileList, serverOptions: JsonObject): FileInfos => {
  const infos: FileInfos = []
  const { length } = files
  if (!length) return infos

  const { extensions, uploadLimits } = serverOptions
  assertObject(extensions)
  assertObject(uploadLimits)

  const extensionsByType = extensions as StringsObject
  const limitsByType = uploadLimits as NumberObject

  for (let i = 0; i < length; i++) {
    const file = files.item(i)
    if (!file) continue

    const { name, size, type } = file

    const coreType = type.split('/').shift()
    if (!isUploadType(coreType)) {
      infos.push({ 
        label: name, value: coreType, 
        error: 'import.type'
      })
      continue
    }
    
    const max = limitsByType[coreType]
    if (!(isAboveZero(max) && max * 1024 * 1024 > size)) {
      infos.push({ label: name, value: `${max}MB`, error: 'import.bytes' })
      continue
    }

    const ext = name.toLowerCase().split('.').pop()
    const exts = extensionsByType[coreType]
    if (!(isPopulatedString(ext) && isArray(exts) && exts.includes(ext))) {
      infos.push({ label: name, value: ext, error: 'import.extension' })
      continue
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
