import type { AssetCacheArgs, DataOrError, RawAsset, RawAssetObject } from '@moviemasher/runtime-shared'
import type { CommandFile, ServerMediaRequest, ServerPromiseArgs } from '@moviemasher/runtime-server'

import { ServerAssetClass } from './ServerAssetClass.js'
import { EventServerAssetPromise, MovieMasher, } from '@moviemasher/runtime-server'
import { ERROR, errorPromise, isDefiniteError } from '@moviemasher/runtime-shared'

export class ServerRawAssetClass extends ServerAssetClass implements RawAsset {
  constructor(object: RawAssetObject) {
    super(object)
    const { request } = object
    this.request = request
  }

  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    // console.log(this.constructor.name, 'ServerRawAssetClass.assetCachePromise', args)
    const { validDirectories } = args
    const { request, type } = this
    const event = new EventServerAssetPromise(request, type, validDirectories)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) {
      return errorPromise(ERROR.Unimplemented, EventServerAssetPromise.Type)
    }
    return promise.then(orError => {
      // console.log(this.constructor.name, 'ServerRawAssetClass.assetCachePromise', orError)
      if (isDefiniteError(orError)) return orError

      return { data: 1 }
    })
  }
  
  serverPromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>> {
    const { request, type: assetType } = this
    const { validDirectories } = args
    
    const { type } = commandFile
    if (type !== assetType) return Promise.resolve({ data: 0 })

    const event = new EventServerAssetPromise(request, assetType, validDirectories)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented, EventServerAssetPromise.Type)

    return promise.then(orError => {
      // console.log(this.constructor.name, 'ServerRawAssetClass.serverPromise', orError)
      if (isDefiniteError(orError)) return orError

      return { data: 1 }
    })
  }

  request: ServerMediaRequest
}
