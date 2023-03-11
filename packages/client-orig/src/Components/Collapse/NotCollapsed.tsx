import React from 'react'


import { PropsAndChildren } from "../../Types/Props"
import { CollapseContext } from './CollapseContext'

export function NotCollapsed(props: PropsAndChildren) {
  const panelContext = React.useContext(CollapseContext)
  if (panelContext.collapsed) return null

  return <>{props.children}</>
}
