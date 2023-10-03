import { error, ERROR, isAssetObject, isAssetType, isDefiniteError, isPopulatedString, type MashAssetObject } from '@moviemasher/runtime-shared'

import { MovieMasher, EventAssetObject } from '@moviemasher/runtime-client'
import { requestJsonRecordPromise, requestPopulate } from '../../utility/request.js'

export const AssetObjectHandler = (event: EventAssetObject) => {
  event.stopImmediatePropagation()
  const { detail } = event
  const { assetObjectOptions } = MovieMasher.options
  if (!assetObjectOptions?.request) {
    const data: MashAssetObject = {
      id: `temporary-${crypto.randomUUID()}`,
      color: '#FFFFFF',
      type: 'video',
      source: 'mash',
    }
    detail.promise = Promise.resolve({ data })
    return
  } 
  const request = requestPopulate(assetObjectOptions.request)
  detail.promise = requestJsonRecordPromise(request).then(orError => {
    // console.log(EventAssetObject.Type, orError)
    if (isDefiniteError(orError)) return orError 

    const { data: json } = orError    
    const { type, source } = json
    if (isAssetType(type) && isPopulatedString(source)) {
      if (isAssetObject(json, type, source)) {
        return { data: json }
      }
    }
    return error(ERROR.Url) 
  })
}

MovieMasher.eventDispatcher.addDispatchListener(EventAssetObject.Type, AssetObjectHandler)
