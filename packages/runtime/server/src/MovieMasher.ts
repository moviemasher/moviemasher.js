import { ServerEventDispatcher } from './ServerEventDispatcher.js'
import { MovieMasherServerRuntime } from './ServerTypes.js'

export const MovieMasher: MovieMasherServerRuntime = {
  eventDispatcher: new ServerEventDispatcher(),
  options: {},
}
