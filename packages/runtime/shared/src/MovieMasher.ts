import type { StringRecord } from './Core.js'
import type { EventDispatcher } from './EventDispatcher.js'

export type ClientOrServer = 'client' | 'server'

export interface MovieMasherOptions {
  imports: StringRecord
}

export interface MovieMasherRuntime {
  eventDispatcher: EventDispatcher
  options: MovieMasherOptions
  importPromise: Promise<void>
}
