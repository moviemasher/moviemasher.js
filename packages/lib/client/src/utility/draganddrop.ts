import type {
  ClientClips, MashAddAssetsEventDetail,
  MashIndex,
  MashMoveClipEvent,
  TrackClipsEventDetail,
} from '@moviemasher/runtime-client'
import type {
  AssetObject, AssetObjects, AssetType, Clip, Point, Rect,
  Strings, UnknownRecord
} from '@moviemasher/runtime-shared'


import {
  eventStop, isClip, 
  isPositive, 
  pixelToFrame
} from '@moviemasher/lib-shared'

import {
  DragSuffix,
  EventTypeImportAssetObjects, EventTypeImportRaw,
  EventTypeMashAddAssets,
  EventTypeMashMoveClip,
  EventTypeTrackClips,
  MovieMasher,
} from '@moviemasher/runtime-client'
import {
  isAssetObject, isAssetType,
  isObject, isString} from '@moviemasher/runtime-shared'
import {
  ImportAssetObjectsEventDetail, ImportEventDetail
} from '../declarations'


export type DragFunction = (event: DragEvent) => void

export type FileInfo = File | UnknownRecord
export type FileInfos = FileInfo[]

export interface DragOffsetObject {
  offset: number
}

export interface DragDefinitionObject extends DragOffsetObject {
  mediaObject: AssetObject
}
export type Draggable = AssetObject | Clip | FileList 

export type TransferType = `${string}/x-moviemasher`

export const TransferTypeFiles = 'Files'

const isDragOffsetObject = (value: any): value is DragOffsetObject => {
  return isObject(value) && 'offset' in value
}
const isDragDefinitionObject = (value: any): value is DragDefinitionObject => {
  return isDragOffsetObject(value) && 'mediaObject' in value && isAssetObject(value.mediaObject)
}

export const isTransferType = (value: any): value is TransferType => {
  return isString(value) && value.endsWith(DragSuffix)
}
// 
export const dropType = (dataTransfer?: DataTransfer | null): TransferType | undefined => {
  if (!dataTransfer) return
  
  return dataTransfer.types.find(isTransferType)
}

const dragMediaType = (transferType: TransferType): AssetType | undefined => {
  const [type] = transferType.split('/')
  return isAssetType(type) ? type : undefined
}

export const dragType = (dataTransfer?: DataTransfer | null): AssetType | undefined => {
  const prefix = dropType(dataTransfer)
  if (!prefix) return

  const [type] = prefix.split('/')
  if (isAssetType(type)) return type
  return undefined
}

export const dragTypes = (dataTransfer?: DataTransfer | null): Strings => {
  if (!dataTransfer) return []

  const { types } = dataTransfer
  return types.filter(type => (
    type === TransferTypeFiles || isTransferType(type)
  ))
}

export const dragTypeValid = (dataTransfer?: DataTransfer | null, allowClip = false): dataTransfer is DataTransfer => {
  const types = dragTypes(dataTransfer)
  // any file can be dropped
  if (types.includes(TransferTypeFiles)) return true

  const type = types.find(isTransferType)
  if (!type) return false

  // anything can be dropped on a clip 
  if (allowClip || type.startsWith('clip')) return true

  const definitionType = dragMediaType(type)
  return !!definitionType 
}


export const dragData = (dataTransfer?: DataTransfer, type?: TransferType) => {
  if (!dataTransfer) return {}
  
  const transferType = type ? `${type}${DragSuffix}` : dragTypes(dataTransfer).find(isTransferType)
  if (!transferType) return {}

  const json = dataTransfer.getData(transferType)
  // console.log('dragData', json, type, transferType)
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

export const dropFiles = (fileList: FileList, mashIndex?: MashIndex) => {
  const detail: ImportEventDetail = { fileList }
  const event = new CustomEvent(EventTypeImportRaw, { detail })
  MovieMasher.eventDispatcher.dispatch(event)
  const { promise } = detail
  if (!promise) return 

  promise.then((assetObjects) => { dropAssetObjects(assetObjects, mashIndex) })
}

export const dropAssetObjects = (assetObjects: AssetObjects, mashIndex?: MashIndex) => {
  if (mashIndex) {
    // console.log('dropAssetObjects', assetObjects, mashIndex)
    const detail: MashAddAssetsEventDetail = { assetObjects, mashIndex }
    const addEvent = new CustomEvent(EventTypeMashAddAssets, { detail })
    MovieMasher.eventDispatcher.dispatch(addEvent) 
    const { promise } = detail
    if (!promise) return
    return promise.then((assets) => {
      console.log('dropAssetObjects PROMISED', assets)
    })
  }
  // console.log('dropAssetObjects', assetObjects.length)

  const detail: ImportAssetObjectsEventDetail = { assetObjects }
  const importEvent = new CustomEvent(EventTypeImportAssetObjects, { detail })
  MovieMasher.eventDispatcher.dispatch(importEvent) 
  return Promise.resolve()
}

export const dropDraggable = (draggable: Draggable, editorIndex?: MashIndex)=> {
  if (isClip(draggable)) {
    // this does not happen since Timeline intercepts
    console.log('dropDraggable Clip')
    return 
  }
  if (isAssetObject(draggable)) {
    return dropAssetObjects([draggable], editorIndex)
  }
  return dropFiles(draggable, editorIndex) 
}

export const droppingFiles = (dataTransfer?: DataTransfer) => {
  if (!dataTransfer) return false

  return dragTypes(dataTransfer).includes(TransferTypeFiles)
}

//  const offsetDrop = scrollX + clientX - viewX   
export const droppedMashIndex = (dataTransfer: DataTransfer, trackIndex = -1, scale = 0, offsetDrop = 0, clipId = ''): MashIndex => {
  const files = droppingFiles(dataTransfer)

  const clientClips: ClientClips = []
  let dense = false
  
  if (isPositive(trackIndex)) {
    const detail: TrackClipsEventDetail = { trackIndex }
    const event = new CustomEvent(EventTypeTrackClips, { detail })
    MovieMasher.eventDispatcher.dispatch(event)
    const { clips } = detail
    if (clips) {
      clientClips.push(...clips)
      dense = !!detail.dense
      // console.debug('droppedMashIndex', trackIndex, clips.length, dense)
    } else {
      // console.warn('droppedMashIndex no clips', trackIndex)
    }
  }
  let indexDrop = -1   
  if (dense) {
    if (clipId) indexDrop = clientClips.findIndex(clip => clip.id === clipId) + 1
  } else {
    const data = files ? { offset: 0 } : dragData(dataTransfer)
    indexDrop = pixelToFrame(Math.max(0, offsetDrop - data.offset), scale)
    // console.debug('droppedMashIndex', indexDrop, "= pixelToFrame(Math.max(0, ", offsetDrop, "-", data.offset, "), ", scale, ")")
  }
  const mashIndex: MashIndex = { clip: indexDrop, track: trackIndex }
  return mashIndex
}

export const dropped = (event: DragEvent, mashIndex?: MashIndex) => {
  eventStop(event)
  const { dataTransfer } = event 
  if (!dataTransfer) return

  const files = droppingFiles(dataTransfer)
  const data = files ? { offset: 0 } : dragData(dataTransfer)

  if (files) {
    dropFiles(dataTransfer.files, mashIndex)
  } else if (data.offset) {
    if (isDragDefinitionObject(data)) {
      console.log('dropped ADD ASSET OBJECT', data)
      const { mediaObject } = data
      dropAssetObjects([mediaObject], mashIndex)
    } else if (mashIndex) {
            console.log('dropped MOVE CLIP', data)

      const moveEvent: MashMoveClipEvent = new CustomEvent(EventTypeMashMoveClip, { detail: mashIndex })
      MovieMasher.eventDispatcher.dispatch(moveEvent)
    }
  } 
}
