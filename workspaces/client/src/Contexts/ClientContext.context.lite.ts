
import type { Client } from '@moviemasher/client-core'
import { createContext } from '../Framework/FrameworkFunctions'

export interface ClientContextInterface {
  client?: Client
}

export default createContext<ClientContextInterface>({})