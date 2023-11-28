import type { AssetObject } from '@moviemasher/runtime-shared'

import { EventAssetObjects, MOVIEMASHER } from '@moviemasher/runtime-client'
import { ERROR, isArray, isDefiniteError, namedError } from '@moviemasher/runtime-shared'
import { requestJsonRecordPromise } from '../../utility/request.js'

export class AssetObjectsHandler {
  static handle(event: EventAssetObjects) {
    event.stopImmediatePropagation()
    const { detail } = event
 
    const { assetObjects } = MOVIEMASHER.options
    if (!assetObjects) {
      detail.promise = Promise.resolve({ data: { assets: [] } }) 
      return
    } 
    if (isArray<AssetObject>(assetObjects)) {
      detail.promise = Promise.resolve({ data: { assets: assetObjects } })
      return 
    }
    
    const { promise, ...rest } = detail

    detail.promise = requestJsonRecordPromise(assetObjects, rest).then(orError => {
      // console.log(EventAssetObjects.Type, orError)
      if (isDefiniteError(orError)) return orError 

      const { data: json } = orError
      if (isArray<AssetObject>(json)) return { data: { assets: json } }

      const { assets, ...rest } = json
      if (isArray<AssetObject>(assets)) return { data: { assets, ...rest } }

      return namedError(ERROR.Url) 
    })
  }
}

// console.debug('asset/objects/fetch.ts listening for', EventAssetObjects.Type)
MOVIEMASHER.eventDispatcher.addDispatchListener(EventAssetObjects.Type, AssetObjectsHandler.handle)
