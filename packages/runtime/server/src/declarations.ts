import { MovieMasherRuntime } from '@moviemasher/runtime-shared'
import { ServerAssetManager } from './ServerAssetManager.js'

export interface MovieMasherServerRuntime extends MovieMasherRuntime {
  assetManager: ServerAssetManager
}