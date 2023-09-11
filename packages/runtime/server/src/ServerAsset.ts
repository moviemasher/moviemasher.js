import type { GraphFiles, ServerPromiseArgs } from './GraphFile.js'
import type { DataOrError, PreloadArgs } from '@moviemasher/runtime-shared'
import type { Asset } from '@moviemasher/runtime-shared'
import type { CommandFile } from './CommandTypes.js'


export interface ServerAsset extends Asset {
  graphFiles(args: PreloadArgs): GraphFiles
  serverPromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>>
}

export type ServerAssets = ServerAsset[]
