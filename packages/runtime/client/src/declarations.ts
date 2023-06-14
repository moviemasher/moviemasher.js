import type { MovieMasherRuntime } from '@moviemasher/runtime-shared'
import type { ClientAssetManager } from './ClientAssetManager.js'

export interface MovieMasherClientRuntime extends MovieMasherRuntime {
  assetManager: ClientAssetManager
  masher: unknown
}