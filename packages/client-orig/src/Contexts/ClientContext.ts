import type { Client } from '@moviemasher/client-core'
import { createContext } from '../Framework/FrameworkFunctions'


export interface ClientContextInterface {
  client?: Client
}

export const ClientContextDefault: ClientContextInterface = {}

export const ClientContext = createContext(ClientContextDefault)
