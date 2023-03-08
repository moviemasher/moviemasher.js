import React from "react"


import { WithClassName } from "../../Types/Core"
import { PropsWithoutChild } from "../../Types/Props"
import { View } from "../../Utilities/View"
import { ActivityContext } from "./ActivityContext"
import { ActivityContentContext } from "./ActivityContentContext"
import { CollapseContext } from "../Collapse/CollapseContext"
import { useContext } from "../../Framework/FrameworkFunctions"
import { ActivityItem } from "./ActivityItem"
import { CollapseControl } from "../Collapse/CollapseControl"
import { NotCollapsed } from "../Collapse/NotCollapsed"
import { Collapsed } from "../Collapse/Collapsed"
import { ActivityLabel } from "./ActivityLabel"
import ActivityPicked from "./ActivityPicked.lite"
import { ActivityProgress } from "./ActivityProgress"
import { MasherContext } from "../Masher/MasherContext"
import Show from "../../Framework/Show/Show.lite"

export interface ActivityContentProps extends WithClassName, PropsWithoutChild {}

export function ActivityContent(props: ActivityContentProps) {
  const masherContext = useContext(MasherContext)
  const activityContext = useContext(ActivityContext)
  const collapseContext = useContext(CollapseContext)
  const { icons } = masherContext
  const { collapsed } = collapseContext
  const { activities } = activityContext
  if (collapsed) return null

  const viewChildren = activities.map(activity => {
    const contextProps = { value: activity, key: activity.id }
    return <ActivityContentContext.Provider { ...contextProps }>
      <ActivityItem className='item' collapsed={true}>
        <CollapseControl key="collapse-control">
          <Show when={collapsed} else={icons.collapse}>{icons.collapsed}</Show>
        </CollapseControl>
        <ActivityLabel key="label" className="label" />
        <ActivityPicked key="active" id="active">
          <ActivityProgress key="progress" />
        </ActivityPicked>
        <ActivityPicked key="error" id="error" children={icons.error} />
        <ActivityPicked key="complete" id="complete" children={icons.complete} />
      </ActivityItem>
    </ActivityContentContext.Provider>
  })
  const viewProps = { ...props, children: viewChildren }
  return <View {...viewProps} />
}
