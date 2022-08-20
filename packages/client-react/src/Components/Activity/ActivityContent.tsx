import React from "react"
import { assertTrue } from "@moviemasher/moviemasher.js"

import { WithClassName, ReactResult, PropsAndChild } from "../../declarations"
import { View } from "../../Utilities/View"
import { ActivityContext } from "./ActivityContext"
import { ActivityContentContext } from "./ActivityContentContext"
import { CollapseContext } from "../Collapse/CollapseContext"

export interface ActivityContentProps extends WithClassName, PropsAndChild {}

/**
 * @parents Activity
 * @children ActivityItem
 */
export function ActivityContent(props: ActivityContentProps): ReactResult {
  const activityContext = React.useContext(ActivityContext)
  const panelContext = React.useContext(CollapseContext)
  const { collapsed } = panelContext
  const { activities } = activityContext
  if (collapsed) return null

  const { children, ...rest } = props
  const child = React.Children.only(children)
  assertTrue(React.isValidElement(child))

  const viewChildren = activities.map(activity => {
    const children = React.cloneElement(child)
    const contextProps = { children, value: activity, key: activity.id }
    const context = <ActivityContentContext.Provider { ...contextProps } />
    return context
  })
  const viewProps = { ...rest, children: viewChildren }
  return <View {...viewProps} />
}
