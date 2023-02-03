import React from 'react'
import { Media } from '@moviemasher/moviemasher.js'

export interface DefinitionContextInterface {
  definition?: Media
}

export const DefinitionContextDefault: DefinitionContextInterface = {
}

export const DefinitionContext = React.createContext(DefinitionContextDefault)
