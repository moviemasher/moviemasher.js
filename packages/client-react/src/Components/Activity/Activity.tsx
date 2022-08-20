import React from "react"
import { 
  ActivityInfo, isEventType, EventType, ActivityType, ClassCollapsed
} from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"
import { ActivityContext, ActivityContextInterface, ActivityGroup, 
  activityLabel, 
  ActivityObject, ActivityObjects, assertActivityGroup 
} from "./ActivityContext"
import { useListeners } from "../../Hooks/useListeners"
import { CollapseContext, CollapseContextInterface } from "../Collapse/CollapseContext"

export interface ActivityProps extends PropsWithChildren, WithClassName {
  initialPicked?: string
  collapsed?: boolean
}

/**
 * @parents Masher
 * @children ActivityContent
 */
export function Activity(props: ActivityProps): ReactResult {
  const { 
    initialPicked = ActivityGroup.Active, 
    collapsed: collapsedProp, 
    className,
    ...rest 
  } = props

  const [collapsed, setCollapsed] = React.useState(!!collapsedProp)
  assertActivityGroup(initialPicked)

  const allActivitiesRef = React.useRef<ActivityObjects>([])
  const { current: allActivities } = allActivitiesRef
  const [activities, setActivities] = React.useState<ActivityObjects>(() => ([]))
  const [picked, setPicked] = React.useState<ActivityGroup>(() => initialPicked || ActivityGroup.Active)
  const [label, setLabel] = React.useState<string>('')

  const getActivities = (activityGroup: ActivityGroup): ActivityObjects => (
    allActivitiesRef.current.filter(activity => activity.activityGroup === activityGroup)
  )

  const handleActivity = (event: Event) => {
    const { type } = event
    if (isEventType(type) && (event instanceof CustomEvent)) {
      const info: ActivityInfo = event.detail
      const { id, type } = info
      const existing = allActivities.find(activity => activity.id === id)

      const activity: ActivityObject = existing || { id, activityGroup: ActivityGroup.Active, infos: [] }
      activity.infos.unshift(info)
      if (collapsed) setLabel(activityLabel(info))
      if (type === ActivityType.Complete) activity.activityGroup = ActivityGroup.Complete
      else if (type === ActivityType.Error) {
        activity.activityGroup = ActivityGroup.Error
      }
   
      if (!existing) allActivities.unshift(activity)
      setActivities(getActivities(picked))
    }
  }
  
  useListeners({ [EventType.Activity]: handleActivity })

  const pick = (activityGroup: ActivityGroup) => {
    setActivities(() => getActivities(activityGroup))
    setPicked(() => activityGroup)
  }

  const activityContext: ActivityContextInterface = { 
    activities, picked, pick, allActivities, label
  }

  const changeCollapsed = (value: boolean) => {
    setLabel('')
    setCollapsed(value)
  }

  const collapseContext: CollapseContextInterface = { collapsed, changeCollapsed }

  const classes: string[] = []
  if (className) classes.push(className)
  if (collapsed) classes.push(ClassCollapsed)

  const viewProps = {
    ...rest,
    className: classes.join(' '),
  }

  return (
    <ActivityContext.Provider value={activityContext}>
      <CollapseContext.Provider value={collapseContext}>
        <View { ...viewProps } />
      </CollapseContext.Provider>
    </ActivityContext.Provider>
  )
}
