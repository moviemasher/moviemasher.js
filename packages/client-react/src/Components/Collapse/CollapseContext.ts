import React from 'react'
import { BooleanSetter } from '@moviemasher/moviemasher.js'

export interface CollapseContextInterface {
  collapsed: boolean,
  changeCollapsed: BooleanSetter
}

export const CollapseContextDefault: CollapseContextInterface = {
  collapsed: false,
  changeCollapsed: () => {},
}

export const CollapseContext = React.createContext(CollapseContextDefault)
