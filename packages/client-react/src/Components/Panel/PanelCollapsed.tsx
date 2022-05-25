import React from 'react'

import { PropsAndChildren, ReactResult } from '../../declarations'
import { PanelContext } from '../../Contexts/PanelContext'

export function PanelCollapsed(props: PropsAndChildren): ReactResult {
  const panelContext = React.useContext(PanelContext)
  if (!panelContext.collapsed) return null

  return <>{props.children}</>
}
