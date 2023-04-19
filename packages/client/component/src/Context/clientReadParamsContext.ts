import type { ClientReadParams } from '@moviemasher/client-core'
import { createContext } from '@lit-labs/context'

export const clientReadParamsContext = createContext<ClientReadParams>('moviemasher-media-type')

