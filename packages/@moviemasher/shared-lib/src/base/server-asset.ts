import type { AssetFiles, CommandFile, ServerAsset, CacheArgs, DataOrError, InstanceArgs, InstanceObject, ServerPromiseArgs, FileWriteArgs } from '../types.js'

import { AssetClass } from '../base/asset.js'
import { $FILE, $SVG, $SVGS, $TXT, $WRITE, MOVIE_MASHER } from '../runtime.js'

export class ServerAssetClass extends AssetClass implements ServerAsset {
  assetFiles(args: CacheArgs): AssetFiles { return [] }
  
  commandFilePromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>> {
    const { file, content, type } = commandFile
    switch(type) {
      case $SVGS: 
      case $TXT: 
      case $SVG: {
        if (!content) break

        const fileArgs: FileWriteArgs = { path: file, content, dontReplace: true, type: $WRITE }
        return MOVIE_MASHER.promise(fileArgs, $FILE)
      }
    }
    return Promise.resolve({ data: 0 })
  }
  
  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }
}
