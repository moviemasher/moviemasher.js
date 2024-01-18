import type { AssetCacheArgs, DataOrError, RawAsset, RawAssetObject, ServerMediaRequest } from '@moviemasher/shared-lib/types.js'
import type { CommandFile, ServerPromiseArgs } from '../types.js'

import { RawAssetMixin } from '@moviemasher/shared-lib'
import { ERROR, errorPromise, isDefiniteError, MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventServerMediaPromise, } from '../runtime.js'
import { ServerAssetClass } from './asset.js'
import { ServerRawAsset } from '../type/ServerTypes.js'

const WithRawAssetMixin = RawAssetMixin(ServerAssetClass)

export class ServerRawAssetClass extends WithRawAssetMixin implements ServerRawAsset {
  constructor(object: RawAssetObject) {
    super(object)
    const { request } = object
    this.request = request
  }

  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    // console.log(this.constructor.name, 'ServerRawAssetClass.assetCachePromise', args)
    const { validDirectories } = args
    const { request, type } = this
    const event = new EventServerMediaPromise(request, type, validDirectories)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) {
      return errorPromise(ERROR.Unimplemented, EventServerMediaPromise.Type)
    }
    return promise.then(orError => {
      // console.log(this.constructor.name, 'ServerRawAssetClass.assetCachePromise', orError)
      if (isDefiniteError(orError)) return orError

      return { data: 1 }
    })
  }

  override commandFilePromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>> {
    const { request, type: assetType } = this
    const { type } = commandFile
    if (type !== assetType) return super.commandFilePromise(args, commandFile)

    const { validDirectories } = args
    const event = new EventServerMediaPromise(request, assetType, validDirectories)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented, EventServerMediaPromise.Type)

    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError

      return super.commandFilePromise(args, commandFile)
    })
  }

  request: ServerMediaRequest
}
