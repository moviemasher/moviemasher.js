import type { Masher } from '@moviemasher/lib-core'
import { createContext } from '@lit-labs/context'

export const masherContext = createContext<Masher | undefined>('moviemasher-masher')

