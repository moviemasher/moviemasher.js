import React from 'react'
import { BooleanSetter } from '@moviemasher/moviemasher.js'

export interface PanelContextInterface {
  collapsed: boolean,
  setCollapsed: BooleanSetter
}

export const PanelContextDefault: PanelContextInterface = {
  collapsed: false,
  setCollapsed: () => {},
}

export const PanelContext = React.createContext(PanelContextDefault)
