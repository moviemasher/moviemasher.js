import type { MovieMasherClientRuntime } from './declarations.js'

import { ClientEventDispatcher } from './ClientEventDispatcher.js'

export const MovieMasher: MovieMasherClientRuntime = {
  eventDispatcher: new ClientEventDispatcher(),
  assetManager: {},
  masher: {}
}
