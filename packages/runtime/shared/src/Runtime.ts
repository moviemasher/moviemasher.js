import { EventDispatcher } from './EventDispatcher.js'

export interface MovieMasherRuntime {
  eventDispatcher: EventDispatcher
  assetManager: unknown
  masher: unknown
}