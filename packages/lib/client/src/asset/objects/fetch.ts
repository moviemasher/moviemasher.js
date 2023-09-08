import type { AssetObject } from '@moviemasher/runtime-shared'

import { ERROR, error, isArray, isAssetObject, isAssetType, isDefiniteError, isPopulatedString } from '@moviemasher/runtime-shared'
import { MovieMasher, EventAssetObjects } from '@moviemasher/runtime-client'
import { requestJsonRecordsPromise, requestPopulate } from '../../utility/request.js'

export class AssetObjectsHandler {
  static handle(event: EventAssetObjects) {
    event.stopImmediatePropagation()
    const { detail } = event
    const { assetObjectsOptions } = MovieMasher.options
    if (!assetObjectsOptions?.request) {
      detail.promise = Promise.resolve({ data: [] }) 
      return
    } 
    const request = requestPopulate(assetObjectsOptions.request)
    detail.promise = requestJsonRecordsPromise(request).then(orError => {
      console.log(EventAssetObjects.Type, orError)
      if (isDefiniteError(orError)) return orError 

      const { data: json } = orError
      const data = json.filter(object => {
        const { type, source } = object
        if (!(isAssetType(type) && isPopulatedString(source))) return false
        
        return isAssetObject(object, type, source)
      })
      if (!isArray<AssetObject>(data)) return error(ERROR.Url) 

      return { data }
    })
  }
}

MovieMasher.eventDispatcher.addDispatchListener(EventAssetObjects.Type, AssetObjectsHandler.handle)
