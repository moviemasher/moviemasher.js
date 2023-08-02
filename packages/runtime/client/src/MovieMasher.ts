import type { MovieMasherRuntime, RequestObject } from '@moviemasher/runtime-shared'
import type { Masher } from './Masher.js'

import { ClientEventDispatcher } from './ClientEventDispatcher.js'
import { MovieMasherClientRuntime } from './ClientTypes.js'

export const MovieMasher: MovieMasherClientRuntime = {
  eventDispatcher: new ClientEventDispatcher(),
  options: {},
}
