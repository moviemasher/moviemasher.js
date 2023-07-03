import type { AssetObjectsEvent } from '../../declarations'
import type { AssetObject } from '@moviemasher/runtime-shared'

import { ErrorName, error, isArray, isAssetObject, isAssetType, isDefiniteError, isPopulatedString } from '@moviemasher/runtime-shared'
import { MovieMasher, EventTypeAssetObjects } from '@moviemasher/runtime-client'
import { requestJsonRecordsPromise, requestPopulate } from '../../utility/request.js'

MovieMasher.eventDispatcher.addDispatchListener(EventTypeAssetObjects, (event: AssetObjectsEvent) => {
  const { assetObjectsOptions = { request: {} } } = MovieMasher.options
  const { request = {}} = assetObjectsOptions
  request.endpoint ||= (new URL('../../../json/asset-objects.json', import.meta.url)).href
  const populated = requestPopulate(request)

  const { detail } = event
  detail.promise = requestJsonRecordsPromise(populated).then(orError => {
    if (isDefiniteError(orError)) return orError 

    const { data: json } = orError
    const assetObjects = json.filter(object => {
      const { type, source } = object
      if (!(isAssetType(type) && isPopulatedString(source))) return false
      
      return isAssetObject(object, type, source)
    })
    if (!isArray<AssetObject>(assetObjects)) return error(ErrorName.Url) 

    return { data: assetObjects }
  })
  event.stopImmediatePropagation()
})

export {}
