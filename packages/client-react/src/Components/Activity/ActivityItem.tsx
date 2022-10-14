import React from "react"

import { PropsWithChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"
import { CollapseContext, CollapseContextInterface } from "../Collapse/CollapseContext"

export interface ActivityItemProps extends PropsWithChildren, WithClassName {
  collapsed?: boolean
}

/**
 * @parents ActivityContent
 * @children ActivityLabel, ActivityPicked, CollapseControl
 */
export function ActivityItem(props: ActivityItemProps): ReactResult {
  const { collapsed: collapsedProp, ...rest } = props

  const [collapsed, changeCollapsed] = React.useState(!!collapsedProp)
  const collapseContext: CollapseContextInterface = { collapsed, changeCollapsed }

  return (
    <CollapseContext.Provider value={collapseContext}>
      <View { ...rest } />
    </CollapseContext.Provider>
  )
}
