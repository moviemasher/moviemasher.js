
import /* type */ { Client } from '@moviemasher/client-core'
import { createContext } from '@builder.io/mitosis'

export interface ClientContextInterface {
  client?: Client
}

export default createContext<ClientContextInterface>({})