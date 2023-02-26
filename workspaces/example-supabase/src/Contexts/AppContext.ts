
import React from 'react'
import { EmptyMethod, VoidMethod } from '@moviemasher/moviemasher.js'

export interface AppContextInterface {
  initialize: VoidMethod
  initialized: boolean
}

export const AppContextDefault: AppContextInterface = { 
  initialize: EmptyMethod,
  initialized: false,
}

export const AppContext = React.createContext(AppContextDefault)
