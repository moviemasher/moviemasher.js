import React from "react"


import { PropsWithChildren } from "../../Types/Props"
import { View } from "../../Utilities/View"
import { CollapseContext, CollapseContextInterface } from "../Collapse/CollapseContext"

export interface ActivityItemProps extends PropsWithChildren {
  collapsed?: boolean
}

/**
 * @parents ActivityContent
 * @children ActivityLabel, ActivityPicked, CollapseControl
 */
export function ActivityItem(props: ActivityItemProps) {
  const { collapsed: collapsedProp, ...rest } = props

  const [collapsed, changeCollapsed] = React.useState(!!collapsedProp)
  const collapseContext: CollapseContextInterface = { collapsed, changeCollapsed }

  return (
    <CollapseContext.Provider value={collapseContext}>
      <View { ...rest } />
    </CollapseContext.Provider>
  )
}
