import React from 'react'
import { Definition } from '@moviemasher/moviemasher.js'

export interface DefinitionContextInterface {
  definition?: Definition
}

export const DefinitionContextDefault: DefinitionContextInterface = {
}

export const DefinitionContext = React.createContext(DefinitionContextDefault)
