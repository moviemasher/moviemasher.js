import React from 'react'

import { PropsAndChildren, ReactResult, WithClassName } from '../../declarations'
import { View } from '../../Utilities/View'
import { CollapseContext, CollapseContextInterface } from '../Collapse/CollapseContext'
import { ClassCollapsed } from '@moviemasher/moviemasher.js'

export interface BroadcasterProps extends PropsAndChildren, WithClassName {
  initialCollapsed?: boolean
}

/**
 * @parents Masher
 * @children BroadcasterContent, BroadcasterControl
 */
export function Broadcaster(props: BroadcasterProps): ReactResult {
  const { 
    initialCollapsed = false, 
    className,
    ...rest 
  } = props

  const [collapsed, setCollapsed] = React.useState(initialCollapsed)

  const classes: string[] = []
  if (className) classes.push(className)
  if (collapsed) classes.push(ClassCollapsed)
  
  const collapseContext: CollapseContextInterface = { collapsed, changeCollapsed: setCollapsed }
  const viewProps = { ...rest, className: classes.join(' ') }

  return <CollapseContext.Provider value={collapseContext}>
    <View {...viewProps}/>
  </CollapseContext.Provider>
}
