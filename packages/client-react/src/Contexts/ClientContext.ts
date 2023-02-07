import React from 'react'
import { Client } from '@moviemasher/client-core'

export interface ClientContextInterface {
  client?: Client
}

export const ClientContextDefault: ClientContextInterface = { 
}

export const ClientContext = React.createContext(ClientContextDefault)
