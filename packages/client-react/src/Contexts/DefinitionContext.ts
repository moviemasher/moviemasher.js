import { Media } from '@moviemasher/moviemasher.js'
import { createContext } from '../Framework/FrameworkFunctions'

export interface DefinitionContextInterface {
  definition?: Media
}

export const DefinitionContextDefault: DefinitionContextInterface = {
}

export const DefinitionContext = createContext(DefinitionContextDefault)
