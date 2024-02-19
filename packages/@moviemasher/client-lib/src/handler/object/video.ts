import type { MashAssetObject } from '@moviemasher/shared-lib/types.js'

import { MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventAssetObject } from '../../utility/events.js'
import { ERROR, isAssetObject, isRawType, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js'
import { requestJsonRecordPromise } from '../../utility/request.js'
import { isPopulatedString } from '@moviemasher/shared-lib/utility/guard.js'

const AssetObjectHandler = (event: EventAssetObject) => {
  event.stopImmediatePropagation()
  const { detail } = event
  const { assetObject } = MOVIEMASHER.options
  if (!assetObject) {
    const data: MashAssetObject = {
      id: `temporary-${crypto.randomUUID()}`,
      color: '#FFFFFF',
      type: 'video',
      source: 'mash',
    }
    detail.promise = Promise.resolve({ data })
    return
  } 
  if (isAssetObject(assetObject)) {
    detail.promise = Promise.resolve({ data: assetObject })
    return
  }
  
  detail.promise = requestJsonRecordPromise(assetObject).then(orError => {
    // console.log(EventAssetObject.Type, orError)
    if (isDefiniteError(orError)) return orError 

    const { data: json } = orError    
    const { type, source } = json
    if (isRawType(type) && isPopulatedString(source)) {
      if (isAssetObject(json, type, source)) {
        return { data: json }
      }
    }
    return namedError(ERROR.Url) 
  })
}

MOVIEMASHER.listenersAdd({ [EventAssetObject.Type]: AssetObjectHandler })

export {}