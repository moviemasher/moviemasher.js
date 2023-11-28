import type { ClipLocation } from '@moviemasher/runtime-client'
import type { AssetType, Strings } from '@moviemasher/runtime-shared'

import { EventAddAssets, EventImport, EventImportManagedAssets, EventManagedAsset, EventMoveClip, MOVIEMASHER, X_MOVIEMASHER, eventStop } from '@moviemasher/runtime-client'
import { isAssetType, isObject, isPopulatedString, isString, jsonParse } from '@moviemasher/runtime-shared'

type TransferType = `${string}/x-moviemasher`

const TransferTypeFiles = 'Files'

export interface DragAssetObject {
  assetId: string
  offset: number
}

export const isDragAssetObject = (value: any): value is DragAssetObject => (
  isObject(value) 
  && 'offset' in value 
  && 'assetId' in value 
  && isPopulatedString(value.assetId)
)

const isTransferType = (value: any): value is TransferType => {
  return isString(value) && value.endsWith(X_MOVIEMASHER)
}

const dragAssetType = (transferType: TransferType): AssetType | undefined => {
  const [type] = transferType.split('/')
  return isAssetType(type) ? type : undefined
}

const dragTypes = (dataTransfer?: DataTransfer | null): Strings => {
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
  
  const transferType = type ? `${type}${X_MOVIEMASHER}` : dragTypes(dataTransfer).find(isTransferType)
  if (!transferType) return {}

  const json = dataTransfer.getData(transferType)
  return json ? jsonParse(json) : {}
}

export const dropRawFiles = (fileList: FileList) => {
  const event = new EventImport(fileList)
  MOVIEMASHER.eventDispatcher.dispatch(event)
  return event.detail.promise
}

const dropFiles = (fileList: FileList, mashIndex?: ClipLocation): void => {
  const promise = dropRawFiles(fileList)
  promise?.then(assetObjects => { 
    if (mashIndex) {
      const assets = assetObjects.flatMap(assetObject => {
        const event = new EventManagedAsset(assetObject)
        MOVIEMASHER.eventDispatcher.dispatch(event)
        const { asset } = event.detail
        return asset ? [asset] : []
      })
      if (assets.length) {
        MOVIEMASHER.eventDispatcher.dispatch(new EventAddAssets(assets, mashIndex)) 
      }
    }
    // console.log('dropFiles EventImportManagedAssets', assetObjects.length)
    MOVIEMASHER.eventDispatcher.dispatch(new EventImportManagedAssets(assetObjects)) 
  })
}

const dropAssetId = (assetId: string, mashIndex?: ClipLocation) => {
  if (mashIndex) {
    const event = new EventManagedAsset(assetId)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    if (asset) {
      MOVIEMASHER.eventDispatcher.dispatch(new EventAddAssets([asset], mashIndex)) 
    }
  }
}

export const droppingFiles = (dataTransfer: DataTransfer | null | undefined): boolean => {
  if (!dataTransfer) return false

  return dragTypes(dataTransfer).includes(TransferTypeFiles)
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
    if (isDragAssetObject(data)) {
      const { assetId } = data
      dropAssetId(assetId, clipLocation)
    } else if (clipLocation) {
      const moveEvent = new EventMoveClip(clipLocation)
      MOVIEMASHER.eventDispatcher.dispatch(moveEvent)
    }
  } 
}
