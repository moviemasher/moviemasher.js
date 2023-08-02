import type { UnknownRecord } from './Core.js'
import type { EventDispatcher } from './EventDispatcher.js'

export interface MovieMasherRuntime {
  eventDispatcher: EventDispatcher
  options: UnknownRecord
}