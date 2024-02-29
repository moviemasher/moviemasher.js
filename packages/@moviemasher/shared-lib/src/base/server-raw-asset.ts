import type { CommandFile, ServerAsset, ServerPromiseArgs, AssetCacheArgs, DataOrError } from '../types.js'

import { $RETRIEVE, ERROR, errorPromise, isDefiniteError, MOVIE_MASHER } from '../runtime.js'
import { ServerAssetClass } from './server-asset.js'

export class ServerRawAssetClass extends ServerAssetClass implements ServerAsset {
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { validDirectories } = args
    const { resource } = this
    if (!resource) return errorPromise(ERROR.Unimplemented, 'resource')

    return MOVIE_MASHER.promise(resource, $RETRIEVE, { validDirectories }).then(functionOrError => {
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

    const promise = MOVIE_MASHER.promise(resource, $RETRIEVE, { validDirectories })
    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError

      return super.commandFilePromise(args, commandFile)
    })
  }
}
