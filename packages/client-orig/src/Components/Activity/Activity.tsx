import React from "react"
import { ClassCollapsed } from '@moviemasher/lib-core'


import { PropsWithChildren } from "../../Types/Props"
import { View } from "../../Utilities/View"
import { ActivityContext, ActivityContextInterface, 
  ActivityGroupActive, 
  assertActivityGroup 
} from "./ActivityContext"
import { CollapseContext, CollapseContextInterface } from "../Collapse/CollapseContext"
import { useMasherActivity } from "../../Hooks/useMasherActivity"

export interface ActivityProps extends PropsWithChildren {
  initialPicked?: string
  initialCollapsed?: boolean
}

/**
 * @parents MasherApp
 * @children ActivityContent
 */
export function Activity(props: ActivityProps) {
  const { 
    initialPicked = ActivityGroupActive, 
    initialCollapsed = false, 
    className,
    ...rest 
  } = props
  assertActivityGroup(initialPicked)

  const [collapsed, setCollapsed] = React.useState(initialCollapsed)
  const [label] = React.useState('')

  const activity = useMasherActivity() 
  const [picked, setPicked] = React.useState(initialPicked)

  const filteredActivities = React.useMemo(() => {
    // console.log("filteredActivities", picked, allActivities.length)
    return activity.filter(activity => activity.activityGroup === picked)
  }, [activity, picked])

  const activityContext: ActivityContextInterface = { 
    activities: filteredActivities, 
    allActivities: activity, 
    picked, pick: setPicked, label
  }


  const collapseContext: CollapseContextInterface = { collapsed, changeCollapsed: setCollapsed }

  const classes: string[] = []
  if (className) classes.push(className)
  if (collapsed) classes.push(ClassCollapsed)

  const viewProps = { ...rest, className: classes.join(' ') }

  return (
    <ActivityContext.Provider value={activityContext}>
      <CollapseContext.Provider value={collapseContext}>
        <View { ...viewProps } />
      </CollapseContext.Provider>
    </ActivityContext.Provider>
  )
}
