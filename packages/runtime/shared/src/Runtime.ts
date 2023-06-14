import type { AssetManager } from './AssetManagerTypes.js'
import type { EventDispatcher } from './EventDispatcher.js'

export interface MovieMasherRuntime {
  eventDispatcher: EventDispatcher
  assetManager: AssetManager
  masher: unknown
}