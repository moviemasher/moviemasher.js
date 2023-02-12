import React from 'react'
import { Client } from '@moviemasher/client-core'
import { clientInstance } from '@moviemasher/client-core'

export interface ClientContextInterface {
  client: Client
}

export const ClientContextDefault: ClientContextInterface = { 
  client: clientInstance()
}

export const ClientContext = React.createContext(ClientContextDefault)
