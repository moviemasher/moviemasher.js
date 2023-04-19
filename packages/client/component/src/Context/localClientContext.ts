import type { LocalClient } from '@moviemasher/client-core'
import { createContext } from '@lit-labs/context'

export const localClientContext = createContext<LocalClient | undefined>('moviemasher-local-client')

