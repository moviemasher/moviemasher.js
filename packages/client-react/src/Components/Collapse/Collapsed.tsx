import React from 'react'

import { PropsAndChildren, ReactResult } from '../../declarations'
import { CollapseContext } from './CollapseContext'

export function Collapsed(props: PropsAndChildren): ReactResult {
  const panelContext = React.useContext(CollapseContext)
  if (!panelContext.collapsed) return null

  return <>{props.children}</>
}
