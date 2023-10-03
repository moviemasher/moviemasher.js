import type { GraphFiles, ServerPromiseArgs } from './GraphFile.js'
import type { DataOrError, CacheArgs } from '@moviemasher/runtime-shared'
import type { Asset } from '@moviemasher/runtime-shared'
import type { CommandFile } from './CommandTypes.js'


export interface ServerAsset extends Asset {
  assetGraphFiles(args: CacheArgs): GraphFiles
  serverPromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>>
}

export type ServerAssets = ServerAsset[]
