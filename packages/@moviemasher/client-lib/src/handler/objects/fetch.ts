import type { AssetObject } from '@moviemasher/shared-lib/types.js'

import { MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventAssetObjects } from '../../module/event.js'
import { ERROR, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js'
import { requestJsonRecordPromise } from '../../utility/request.js'
import { isArray } from '@moviemasher/shared-lib/utility/guard.js'

export class AssetObjectsHandler {
  static handle(event: EventAssetObjects) {
    event.stopImmediatePropagation()
    const { detail } = event
 
    const { assetObjects } = MOVIE_MASHER.options
    if (!assetObjects) {
      detail.promise = Promise.resolve({ data: { assets: [] } }) 
      return
    } 
    if (isArray<AssetObject>(assetObjects)) {
      detail.promise = Promise.resolve({ data: { assets: assetObjects } })
      return 
    }
    
    const { promise: _, ...rest } = detail
    // console.log('AssetObjectsHandler.handle', rest)
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

MOVIE_MASHER.listenersAdd({ [EventAssetObjects.Type]: AssetObjectsHandler.handle })
