import type { AssetCacheArgs, DataOrError } from '@moviemasher/shared-lib/types.js'
import type { CommandFile, ServerPromiseArgs } from '../types.js'
import type { ServerRawAsset } from '../type/ServerTypes.js'

import { $RETRIEVE, ERROR, errorPromise, isDefiniteError, MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'
import { ServerAssetClass } from './asset.js'
import { RawAssetMixin } from '@moviemasher/shared-lib/mixin/raw.js'

const WithRawAssetMixin = RawAssetMixin(ServerAssetClass)

export class ServerRawAssetClass extends WithRawAssetMixin implements ServerRawAsset {
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    // console.log(this.constructor.name, 'ServerRawAssetClass.assetCachePromise', args)
    const { validDirectories } = args
    const { resource } = this
    if (!resource) return errorPromise(ERROR.Unimplemented, 'resource')

    return MOVIEMASHER.promise($RETRIEVE, resource, { validDirectories }).then(functionOrError => {
      if (isDefiniteError(functionOrError)) return functionOrError

      return { data: 1 }
    })
  }

  override commandFilePromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>> {
    const { resource, type: assetType } = this
    if (!resource) return errorPromise(ERROR.Unimplemented, 'resource')
    
    const { type } = commandFile
    if (type !== assetType) return super.commandFilePromise(args, commandFile)

    const { validDirectories } = args

    const promise = MOVIEMASHER.promise($RETRIEVE, resource, { validDirectories })
    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError

      return super.commandFilePromise(args, commandFile)
    })
  }
}
