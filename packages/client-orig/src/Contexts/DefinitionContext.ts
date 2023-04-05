import { Media } from '@moviemasher/lib-core'
import { createContext } from '../Framework/FrameworkFunctions'

export interface DefinitionContextInterface {
  definition?: Media
}

export const DefinitionContextDefault: DefinitionContextInterface = {
}

export const DefinitionContext = createContext(DefinitionContextDefault)
