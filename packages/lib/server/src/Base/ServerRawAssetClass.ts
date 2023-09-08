import type { AssetCacheArgs, RawAsset, RawAssetObject } from '@moviemasher/runtime-shared'
import type { ServerMediaRequest, ServerPromiseArgs } from '@moviemasher/runtime-server'

import { ServerAssetClass } from './ServerAssetClass.js'
import { EventServerAssetPromise, MovieMasher, } from '@moviemasher/runtime-server'
import { ERROR, errorThrow, isDefiniteError } from '@moviemasher/runtime-shared'

export class ServerRawAssetClass extends ServerAssetClass implements RawAsset {
  constructor(object: RawAssetObject) {
    super(object)
    const { request } = object
    this.request = request
  }


  override assetCachePromise(args: AssetCacheArgs): Promise<void> {
    console.log(this.constructor.name, 'assetCachePromise', args)
    const { request, type } = this
    const event = new EventServerAssetPromise(request, type)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) {
      console.error(this.constructor.name, 'assetCachePromise EventServerAssetPromise no promise', request)
      return errorThrow(ERROR.Unimplemented, EventServerAssetPromise.Type)
    }
    return promise.then(orError => {
      console.log(this.constructor.name, 'assetCachePromise', orError)
      if (isDefiniteError(orError)) errorThrow(orError)
    })
  }
  
  serverPromise(_args: ServerPromiseArgs): Promise<void> {
    const { request, type } = this
    const event = new EventServerAssetPromise(request, type)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return Promise.resolve()

    return promise.then(orError => {
      if (!isDefiniteError(orError)) {
        const { data } = orError
        this.serverPath = data
      }
    })
  }

  request: ServerMediaRequest
}
