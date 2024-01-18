import type { AssetObject, CacheArgs, DataOrError, InstanceArgs, InstanceObject, IntrinsicOptions } from '@moviemasher/shared-lib/types.js'
import type { CommandFile, AssetFile, AssetFiles, ServerAsset, ServerPromiseArgs } from '../types.js'

import { AssetClass } from '@moviemasher/shared-lib/base/asset.js'
import { assertAsset, FONT, IMAGE, isDefiniteError, isString, jsonStringify, MOVIEMASHER, SVG, SVGS, TXT } from '@moviemasher/shared-lib/runtime.js'
import { EventServerManagedAsset } from '../runtime.js'
import { fileCopyPromise, fileLinkPromise, filePathExists, fileWritePromise } from '../utility/File.js'
import path from 'path'
import { ENV, ENV_KEY } from '../utility/EnvironmentConstants.js'
import { assertTrue } from '@moviemasher/shared-lib/utility/guards.js'

export class ServerAssetClass extends AssetClass implements ServerAsset {
  override asset(assetId: string | AssetObject): ServerAsset {
    const event = new EventServerManagedAsset(assetId)
    const handled = MOVIEMASHER.eventDispatcher.dispatch(event)
    assertTrue(handled, 'handled')

    const { asset } = event.detail
    assertAsset(asset, jsonStringify(assetId))
    
    return asset
  }

  assetFiles(args: CacheArgs): AssetFiles { return [] }
  
  commandFilePromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>> {
    const { file, content, type } = commandFile
    // console.log(this.constructor.name, 'ServerAssetClass.commandFilePromise', { source: file, type })
    switch(type) {
      case SVGS: 
      case TXT: 
      case SVG: {
        if (!content) break

        return fileWritePromise(file, content, true).then(() => ({ data: 1 }))
      }
      // case IMAGE: {
      //   const destination = path.join(this.imageDirectory, path.basename(file))
      //   return fileCopyPromise(file, destination).then(copyOrError => {
      //     console.log(this.constructor.name, 'ServerAssetClass.commandFilePromise IMAGE', { destination, copyOrError }, filePathExists(destination))
      //     if (isDefiniteError(copyOrError)) return copyOrError

      //     return { data: 1 }
      //   })
      // }
      case FONT: {
        const destination = path.join(this.fontDirectory, path.basename(file))
        return fileCopyPromise(file, destination).then(copyOrError => {
          // console.log(this.constructor.name, 'ServerAssetClass.commandFilePromise FONT', { destination, copyOrError }, filePathExists(destination))
          if (isDefiniteError(copyOrError)) return copyOrError

          return { data: 1 }
        })
      }
    }
    return Promise.resolve({ data: 0 })
  }
  
  // TODO: get this from an environment variable

  get fontDirectory(): string {
    return '/usr/share/fonts'
  }

  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }
}
