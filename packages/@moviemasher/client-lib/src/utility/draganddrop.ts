import type { ClientAssets, ClientClips, ClipLocation } from '../types.js'
import type { AssetObject, AssetObjects, RawType, DataOrError, Source, Strings } from '@moviemasher/shared-lib/types.js'

import { INDEX_LAST, X_MOVIEMASHER, eventStop, isClientAsset } from '../runtime.js'
import { EventManagedAssetPromise, EventAddAssets, EventImport, EventImportFile, EventImportManagedAssets, EventMoveClip, EventTrackClips } from './events.js'
import { ERROR, MOVIEMASHER, $RAW, errorPromise, isRawType, isDefiniteError,  jsonParse } from '@moviemasher/shared-lib/runtime.js'
import { isPositive } from '@moviemasher/shared-lib/utility/guard.js'
import { pixelToFrame } from './pixel.js'
import { isObject, isPopulatedString, isString } from '@moviemasher/shared-lib/utility/guard.js'

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

const dragRawType = (transferType: TransferType): RawType | undefined => {
  const [type] = transferType.split('/')
  return isRawType(type) ? type : undefined
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

  return !!dragRawType(type)
}

export const dragData = (dataTransfer?: DataTransfer, type?: TransferType) => {
  if (!dataTransfer) return {}
  
  const transferType = type ? `${type}${X_MOVIEMASHER}` : dragTypes(dataTransfer).find(isTransferType)
  if (!transferType) return {}

  const json = dataTransfer.getData(transferType)
  return json ? jsonParse(json) : {}
}

export const dropFile = (file: File, source: Source = $RAW): Promise<DataOrError<AssetObject>> => {
  const event = new EventImportFile(file, source)
  MOVIEMASHER.dispatch(event)
  const { promise } = event.detail
  return promise || errorPromise(ERROR.Unimplemented, EventImportFile.Type)
}

export const dropRawFiles = (fileList: FileList) => {
  const event = new EventImport(fileList)
  MOVIEMASHER.dispatch(event)
  return event.detail.promise
}

const dropFiles = async (fileList: FileList, mashIndex?: ClipLocation): Promise<AssetObjects> => {
  const assetObjects: AssetObjects = []
  for (const file of fileList) {
    const orError = await dropFile(file)
    if (isDefiniteError(orError)) continue

    assetObjects.push(orError.data)
  }
  if (assetObjects.length) {
    if (mashIndex) {
      const assets: ClientAssets = [] 
      for (const assetObject of assetObjects) {
        
        const event =  new EventManagedAssetPromise(assetObject)
        MOVIEMASHER.dispatch(event)
        const { promise } = event.detail
        if (!promise) continue
        
        const orError = await promise
        if (isDefiniteError(orError)) continue
        
        const { data: asset } = orError
        if (!isClientAsset(asset)) continue

        assets.push(asset)
      }
      if (assets.length) {
        const addEvent = new EventAddAssets(assets, mashIndex)
        MOVIEMASHER.dispatch(addEvent) 
      }
    }
    // console.log('dropFiles EventImportManagedAssets', assetObjects.length)
    MOVIEMASHER.dispatch(new EventImportManagedAssets(assetObjects)) 
  }
  return assetObjects
}

export const droppingFiles = (dataTransfer: DataTransfer | null | undefined): boolean => {
  if (!dataTransfer) return false

  return dragTypes(dataTransfer).includes(TransferTypeFiles)
}

export const dropped = async (event: DragEvent, clipLocation?: ClipLocation) => {
  eventStop(event)
  const { dataTransfer } = event 
  if (!dataTransfer) {
    console.log('dropped with no dataTransfer')
    return
  }

  const files = droppingFiles(dataTransfer)
  const data = files ? { offset: 0 } : dragData(dataTransfer)
  // console.log('dropped', files, data)

  if (files) {
    dropFiles(dataTransfer.files, clipLocation)
  } else {
    if (data.offset) {
      // console.log('dropped with offset', data, clipLocation, isDragAssetObject(data))
      if (isDragAssetObject(data)) {
        const { assetId } = data
        if (clipLocation) {
          const event = new EventManagedAssetPromise(assetId)
          MOVIEMASHER.dispatch(event)
          const { promise } = event.detail
          if (!promise) return
        
          const orError = await promise
          if (isDefiniteError(orError)) return
          
          const { data: asset } = orError
          if (!isClientAsset(asset)) return

          MOVIEMASHER.dispatch(new EventAddAssets([asset], clipLocation)) 
        }
      } else if (clipLocation) {
        const moveEvent = new EventMoveClip(clipLocation)
        MOVIEMASHER.dispatch(moveEvent)
      }
    } else {
      // console.log('dropped with no offset', data)
    }
  } 
}


export const droppedMashIndex = (dataTransfer: DataTransfer, trackIndex = INDEX_LAST, scale = 0, offsetDrop = 0, clipId = ''): ClipLocation => {
  //  eg. offsetDrop = scrollX + clientX - viewX   
  const files = droppingFiles(dataTransfer)
  const clientClips: ClientClips = []
  let isDense = false
  if (isPositive(trackIndex)) {
    const event = new EventTrackClips(trackIndex)
    MOVIEMASHER.dispatch(event)
    const { clips, dense } = event.detail
    if (clips) {
      clientClips.push(...clips)
      isDense = !!dense
    }
  }
  const location: ClipLocation = { track: trackIndex }
  if (isDense) {
    if (clipId) {
      location.index = clientClips.findIndex(clip => clip.id === clipId)
    } else location.index = INDEX_LAST
  } else {
    const data = files ? { offset: 0 } : dragData(dataTransfer)
    // console.log('droppedMashIndex', { data, offsetDrop, scale })
    location.frame = pixelToFrame(Math.max(0, offsetDrop - data.offset), scale)
  }
  return location
}
