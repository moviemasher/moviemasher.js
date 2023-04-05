import { BooleanSetter } from '@moviemasher/lib-core'
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
