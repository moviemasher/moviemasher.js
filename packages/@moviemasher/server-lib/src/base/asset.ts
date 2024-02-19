import type { AssetObject, CacheArgs, DataOrError, InstanceArgs, InstanceObject } from '@moviemasher/shared-lib/types.js'
import type { AssetFiles, CommandFile, ServerAsset, ServerAssetManager, ServerPromiseArgs } from '../types.js'

import { AssetClass } from '@moviemasher/shared-lib/base/asset.js'
import { assertAsset, ERROR, errorThrow, $FONT, isDefiniteError, jsonStringify, $SVG, $SVGS, $TXT } from '@moviemasher/shared-lib/runtime.js'
import path from 'path'
import { fileCopyPromise, fileWritePromise } from '../utility/file.js'
import { ENV, ENV_KEY } from '../utility/env.js'

export class ServerAssetClass extends AssetClass implements ServerAsset {
  constructor(object: AssetObject, manager?: ServerAssetManager) {
    super(object)
    this.manager = manager
  }
  override asset(assetId: string | AssetObject): ServerAsset {
    const asset = this.assetManager.asset(assetId)
    assertAsset(asset, jsonStringify(assetId))
    
    return asset
  }

  assetFiles(args: CacheArgs): AssetFiles { return [] }
  
  get assetManager(): ServerAssetManager { 
    const { manager } = this
    if (!manager) errorThrow(ERROR.AssetId, 'assetManager')
    
    return manager
  }

  protected manager?: ServerAssetManager 
  
  commandFilePromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>> {
    const { file, content, type } = commandFile
    switch(type) {
      case $SVGS: 
      case $TXT: 
      case $SVG: {
        if (!content) break

        return fileWritePromise(file, content, true).then(() => ({ data: 1 }))
      }
      // we do this during retrieve now
      // case $FONT: {
      //   const ttfFile = path.join(ENV.get(ENV_KEY.FontDir), path.basename(file))
      //   // console.log('ServerAssetClass commandFilePromise', { file, ttfFile })
      //   return fileCopyPromise(file, ttfFile).then(copyOrError => (
      //     isDefiniteError(copyOrError) ? copyOrError : { data: 1 }
      //   ))
      // }
    }
    return Promise.resolve({ data: 0 })
  }
  
  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }
}
