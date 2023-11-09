import type { ClientClips, ClipLocation } from '@moviemasher/runtime-client'
import type { AssetType, Clip, Point, Rect, Strings, UnknownRecord } from '@moviemasher/runtime-shared'

import { isClip, isPositive } from '@moviemasher/lib-shared'
import { INDEX_LAST, DragSuffix, EventAddAssets, EventImport, EventManagedAsset, EventImportManagedAssets, MovieMasher, eventStop, EventTrackClips, EventMoveClip } from '@moviemasher/runtime-client'
import { isAssetType, isObject, isPopulatedString, isString } from '@moviemasher/runtime-shared'
import { pixelToFrame } from '../Client/PixelFunctions.js'

export type DragFunction = (event: DragEvent) => void

export type FileInfo = File | UnknownRecord
export interface FileInfos extends Array<FileInfo>{}

export interface DragOffsetObject {
  offset: number
}

export interface DragDefinitionObject extends DragOffsetObject {
  assetId: string
}
export type Draggable = string | Clip | FileList 

export type TransferType = `${string}/x-moviemasher`

export const TransferTypeFiles = 'Files'

const isDragOffsetObject = (value: any): value is DragOffsetObject => {
  return isObject(value) && 'offset' in value
}
export const isDragDefinitionObject = (value: any): value is DragDefinitionObject => {
  return isDragOffsetObject(value) && 'assetId' in value && isPopulatedString(value.assetId)
}

export const isTransferType = (value: any): value is TransferType => {
  return isString(value) && value.endsWith(DragSuffix)
}
// 
export const dropType = (dataTransfer?: DataTransfer | null): TransferType | undefined => {
  if (!dataTransfer) return
  
  return dataTransfer.types.find(isTransferType)
}

const dragAssetType = (transferType: TransferType): AssetType | undefined => {
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
  if (type.startsWith('clip')) return allowClip

  return !!dragAssetType(type)
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

export const dropRawFiles = (fileList: FileList) => {
  const event = new EventImport(fileList)
  MovieMasher.eventDispatcher.dispatch(event)
  return event.detail.promise
}

const dropFiles = (fileList: FileList, mashIndex?: ClipLocation): void => {
  const promise = dropRawFiles(fileList)
  promise?.then(assetObjects => { 
    if (mashIndex) {
      const assets = assetObjects.flatMap(assetObject => {
        const event = new EventManagedAsset(assetObject)
        MovieMasher.eventDispatcher.dispatch(event)
        const { asset } = event.detail
        return asset ? [asset] : []
      })
      if (assets.length) {
        MovieMasher.eventDispatcher.dispatch(new EventAddAssets(assets, mashIndex)) 
      }
    }
    // console.log('dropFiles EventImportManagedAssets', assetObjects.length)
    MovieMasher.eventDispatcher.dispatch(new EventImportManagedAssets(assetObjects)) 
  })
}

const dropAssetId = (assetId: string, mashIndex?: ClipLocation) => {
  if (mashIndex) {
    const event = new EventManagedAsset(assetId)
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    if (asset) {
      MovieMasher.eventDispatcher.dispatch(new EventAddAssets([asset], mashIndex)) 
    }
  }
}


export const dropDraggable = (draggable: Draggable, editorIndex?: ClipLocation)=> {
  if (isClip(draggable)) {
    // this does not happen since Timeline intercepts
    // console.trace('dropDraggable Clip')
    return 
  }
  if (isString(draggable)) return dropAssetId(draggable, editorIndex)
  
  return dropFiles(draggable, editorIndex) 
}

export const droppingFiles = (dataTransfer: DataTransfer | null | undefined): boolean => {
  if (!dataTransfer) return false

  return dragTypes(dataTransfer).includes(TransferTypeFiles)
}

//  const offsetDrop = scrollX + clientX - viewX   
export const droppedMashIndex = (dataTransfer: DataTransfer, trackIndex = INDEX_LAST, scale = 0, offsetDrop = 0, clipId = ''): ClipLocation => {
  const files = droppingFiles(dataTransfer)

  const clientClips: ClientClips = []
  let isDense = false
  
  if (isPositive(trackIndex)) {
    const event = new EventTrackClips(trackIndex)
    MovieMasher.eventDispatcher.dispatch(event)
    const { clips, dense } = event.detail
    if (clips) {
      clientClips.push(...clips)
      isDense = !!dense
      // console.debug('droppedMashIndex', trackIndex, clips.length, dense, scale, offsetDrop)
    } else {
      // console.warn('droppedMashIndex no clips', trackIndex)
    }
  }
  
  const mashIndex: ClipLocation = { track: trackIndex }

  if (isDense) {
    mashIndex.index = clipId ? clientClips.findIndex(clip => clip.id === clipId) + 1 : INDEX_LAST
  } else {
    const data = files ? { offset: 0 } : dragData(dataTransfer)
    mashIndex.frame = pixelToFrame(Math.max(0, offsetDrop - data.offset), scale)
  }
  return mashIndex
}

export const dropped = (event: DragEvent, clipLocation?: ClipLocation) => {
  eventStop(event)
  const { dataTransfer } = event 
  if (!dataTransfer) return

  const files = droppingFiles(dataTransfer)
  const data = files ? { offset: 0 } : dragData(dataTransfer)

  if (files) {
    dropFiles(dataTransfer.files, clipLocation)
  } else if (data.offset) {
    if (isDragDefinitionObject(data)) {
      // console.log('dropped ADD TARGET_ASSET OBJECT', data)
      const { assetId } = data
      dropAssetId(assetId, clipLocation)
    } else if (clipLocation) {
      const moveEvent = new EventMoveClip(clipLocation)
      MovieMasher.eventDispatcher.dispatch(moveEvent)
    }
  } 
}
