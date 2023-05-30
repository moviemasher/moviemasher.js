import type { RemoteClient } from '../Client/RemoteClient.js'
import type { 
  UnknownRecord, Clip, Point, Rect, MediaObject, MashAssetObject, Strings, 
  Effect, MashIndex, MediaArray, Masher, 
} from '@moviemasher/lib-core'
import {
  isString, isObject, isMediaType, 
  MediaType, assertMediaType, 
  isUndefined, ClassDropping, ClassDroppingAfter, 
  ClassDroppingBefore, errorThrow, 
  arrayOfNumbers, 
  isDefiniteError, isMashAssetObject, isEffect, isClip, 
  isAssetObject, 
} from '@moviemasher/lib-core'

export const PositionAfter: PositionAfter = 'after'
export const PositionAt: PositionAt = 'at'
export const PositionBefore: PositionBefore = 'before'
export const PositionNone: PositionNone = 'none'
export type PositionAfter = 'after'
export type PositionAt = 'at'
export type PositionBefore = 'before'
export type PositionNone = 'none'

export type Position = PositionAt | PositionBefore | PositionAfter | PositionNone


export type DragFunction = (event: DragEvent) => void

export const DragSuffix = '/x-moviemasher'

export type FileInfo = File | UnknownRecord
export type FileInfos = FileInfo[]

export interface DragOffsetObject {
  offset: number
}
export const isDragOffsetObject = (value: any): value is DragOffsetObject => {
  return isObject(value) && "offset" in value
}
export function assertDragOffsetObject(value: any): asserts value is DragOffsetObject {
  if (!isDragOffsetObject(value)) errorThrow(value, 'DragOffsetObject')
}

export interface DragDefinitionObject extends DragOffsetObject {
  mediaObject: UnknownRecord
}
export const isDragDefinitionObject = (value: any): value is DragDefinitionObject => {
  return isDragOffsetObject(value) && "mediaObject" in value && isObject(value.mediaObject)
}
export function assertDragDefinitionObject(value: any): asserts value is DragDefinitionObject {
  if (!isDragDefinitionObject(value)) errorThrow(value, 'DragDefinitionObject')
}

export interface DragLayerObject extends UnknownRecord {
  offset: number
  mashAndMedia?: MashAssetObject
}


export type Draggable = MediaObject | MashAssetObject | Clip | FileList | Effect


export const TransferTypeFiles = 'Files'
export type TransferType = string 
export const isTransferType = (value: any): value is TransferType => {
  return isString(value) && value.endsWith(DragSuffix)
}
// 
export const dropType = (dataTransfer?: DataTransfer | null): TransferType | undefined => {
  if (!dataTransfer) return
  
  return dataTransfer.types.find(isTransferType)
}

export const dragMediaType = (transferType: TransferType): MediaType => {
  const [type] = transferType.split('/')
  assertMediaType(type)
  return type
}

export const dragType = (dataTransfer?: DataTransfer | null): MediaType | undefined => {
  const prefix = dropType(dataTransfer)
  if (!prefix) return

  const [type] = prefix.split('/')
  if (isMediaType(type)) return type
}

export const dragTypes = (dataTransfer: DataTransfer): Strings => {
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

// export const dropFilesFromList = (files: FileList, serverOptions: JsonRecord = {}): FileInfos => {
//   const infos: FileInfos = []
//   const { length } = files
//   if (!length) return infos

//   const exists = isPopulatedObject(serverOptions)
//   const { extensions = {}, uploadLimits = {} } = serverOptions
//   const extensionsByType = extensions as StringsRecord
//   const limitsByType = uploadLimits as NumberRecord
//   const numbers = arrayOfNumbers(length)
//   numbers.forEach(fileIndex => {
//     const file = files.item(fileIndex)
//     console.log('dropFilesFromList file', file, fileIndex, files[fileIndex])
//     if (!file) return


//     const { name, size, type } = file
//     const coreType = mediaTypeFromMime(type) 
//       console.log('dropFilesFromList file', file, type)
//     if (!isEncodingType(coreType)) {
//       infos.push({ label: name, value: coreType, error: 'import.type' })
//       return
//     }
    
//     const max = limitsByType[coreType]
//     if (exists && !(isAboveZero(max) && max * 1024 * 1024 > size)) {
//       infos.push({ label: name, value: `${max}MB`, error: 'import.bytes' })
//       return
//     }

//     const ext = name.toLowerCase().split('.').pop()
//     const extDefined = isPopulatedString(ext)
//     const exts = extensionsByType[coreType]
//     if (exists || !extDefined) {
//       if (!(extDefined && isArray(exts) && exts.includes(ext))) {
//         infos.push({ label: name, value: ext, error: 'import.extension' })
//         return
//       } 
//     }
//     infos.push(file)
//   })
//   console.log('dropFilesFromList infos', infos, length, ...numbers)
//   return infos
// }


export const droppingPositionClass = (droppingPosition?: Position | number): string => {
  if (isUndefined(droppingPosition)) return ''

  switch (droppingPosition) {
    case PositionAfter: return ClassDroppingAfter
    case PositionBefore: return ClassDroppingBefore
    case PositionNone: return ''
  }
  return ClassDropping
}

export const dropFiles = (masher: Masher, client: RemoteClient, fileList: FileList, editorIndex?: MashIndex): Promise<MediaArray> => {
  const media: MediaArray = []
  const { length } = fileList
  const fileOrNulls = arrayOfNumbers(length).map(i => fileList.item(i))
  const list = fileOrNulls.filter(file => file !== null) as File[]
  const [file, ...rest] = list

  let promise = client.fileMedia(file)
  rest.forEach(file => {
    promise = promise.then(orError => {
      if (isDefiniteError(orError)) return orError
      const { data } = orError
      media.push(data)

      return client.fileMedia(file)
    })
  })

  return promise.then(orError => {
    if (isDefiniteError(orError)) {
      console.error(orError)
      return []
    }
    const { data } = orError
    media.push(data)
    return masher.addMedia(media, editorIndex)
  })
}

export const dropMediaObject = (masher: Masher, definitionObject: MediaObject, editorIndex?: MashIndex): Promise<MediaArray>  => {
  // console.log("MasherApp onDrop MediaObject...", definitionObject, editorIndex)
  return masher.addMediaObjects(definitionObject, editorIndex)
}

export const dropDraggable = (masher: Masher, client: RemoteClient, draggable: Draggable, editorIndex?: MashIndex): Promise<MediaArray>  => {
  console.log("dropDraggable", editorIndex, draggable)

  
  if (!draggable) return Promise.resolve([]) 
  console.log("dropDraggable editorIndex", editorIndex)

  if (isClip(draggable)) {
    // this does not happen since Timeline intercepts
    console.log("dropDraggable Clip")
    return Promise.resolve([])
  }
  if (isEffect(draggable)) {
    console.log("dropDraggable Effect")
    return Promise.resolve([])
  }
  
  if (isMashAssetObject(draggable)) {
    console.log("dropDraggable MashAssetObject")
    return Promise.resolve([])
  }
  if (isAssetObject(draggable)) {
    console.log("dropDraggable MediaObject")
    return dropMediaObject(masher, draggable, editorIndex)
    
  }
  return dropFiles(masher, client, draggable, editorIndex) 
}
