import type { RemoteClient } from '@moviemasher/client-core'
import { createContext } from '@lit-labs/context'

export const remoteClientContext = createContext<RemoteClient | undefined>('moviemasher-remote-client')

