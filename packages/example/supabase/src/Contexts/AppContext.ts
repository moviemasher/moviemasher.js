
import React from 'react'
import { EmptyFunction, EmptyFunctionType } from '@moviemasher/lib-core'

export interface AppContextInterface {
  initialize: EmptyFunctionType
  initialized: boolean
}

export const AppContextDefault: AppContextInterface = { 
  initialize: EmptyFunction,
  initialized: false,
}

export const AppContext = React.createContext(AppContextDefault)
