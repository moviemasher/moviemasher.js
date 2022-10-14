import React from "react"
import { ClassCollapsed } from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"
import { ActivityContext, ActivityContextInterface, ActivityGroup, 
  assertActivityGroup 
} from "./ActivityContext"
import { CollapseContext, CollapseContextInterface } from "../Collapse/CollapseContext"
import { useEditorActivity } from "../../Hooks/useEditorActivity"

export interface ActivityProps extends PropsWithChildren, WithClassName {
  initialPicked?: string
  initialCollapsed?: boolean
}

/**
 * @parents Masher
 * @children ActivityContent
 */
export function Activity(props: ActivityProps): ReactResult {
  const { 
    initialPicked = ActivityGroup.Active, 
    initialCollapsed = false, 
    className,
    ...rest 
  } = props
  assertActivityGroup(initialPicked)

  const [collapsed, setCollapsed] = React.useState(initialCollapsed)
  const [label, setLabel] = React.useState('')

  const [editor, activity] = useEditorActivity() 
  const [picked, setPicked] = React.useState(initialPicked)

  const filteredActivities = React.useMemo(() => {
    // console.log("filteredActivities", picked, allActivities.length)
    return activity.filter(activity => activity.activityGroup === picked)
  }, [picked, activity.length])

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
