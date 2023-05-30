import { EventDispatcher } from '@moviemasher/runtime-shared'
import { ClientEventDispatcher } from './ClientEventDispatcher.js'

export const MovieMasher: EventDispatcher = new ClientEventDispatcher()
