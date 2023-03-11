import { BooleanSetter } from '@moviemasher/moviemasher.js'
import { createContext } from '../../Framework/FrameworkFunctions'

export interface CollapseContextInterface {
  collapsed: boolean,
  changeCollapsed: BooleanSetter
}

export const CollapseContextDefault: CollapseContextInterface = {
  collapsed: false,
  changeCollapsed: () => {},
}

export const CollapseContext = createContext(CollapseContextDefault)
