import type { MovieMasherRuntime } from '@moviemasher/runtime-shared'
import { ServerEventDispatcher } from './ServerEventDispatcher.js'

export const MovieMasher: MovieMasherRuntime = {
  eventDispatcher: new ServerEventDispatcher(),
  assetManager: {},
  masher: {}
}
