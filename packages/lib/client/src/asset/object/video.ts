import type { MashAssetObject } from '@moviemasher/runtime-shared'

import { EventAssetObject, MOVIEMASHER } from '@moviemasher/runtime-client'
import { ERROR, isAssetObject, isAssetType, isDefiniteError, isPopulatedString, namedError } from '@moviemasher/runtime-shared'
import { requestJsonRecordPromise } from '../../utility/request.js'

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
    if (isAssetType(type) && isPopulatedString(source)) {
      if (isAssetObject(json, type, source)) {
        return { data: json }
      }
    }
    return namedError(ERROR.Url) 
  })
}

MOVIEMASHER.eventDispatcher.addDispatchListener(EventAssetObject.Type, AssetObjectHandler)

export {}