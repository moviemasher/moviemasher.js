import React from "react"
import { 
  assertObject, isAboveZero, isPopulatedArray, isPopulatedString, isPositive 
} from "@moviemasher/lib-core"


import { WithClassName } from "../../Types/Core"
import { PropsWithoutChild } from "../../Types/Props"
import { ActivityContext, ActivityGroupActive } from "./ActivityContext"
import { View } from "../../Utilities/View"
import { ActivityContentContext } from "./ActivityContentContext"

export interface ActivityProgressProps extends PropsWithoutChild, WithClassName {}
/**
 * @parents Activity
 */
 export function ActivityProgress(props: ActivityProgressProps) {
  const activityContext = React.useContext(ActivityContext)
  const activityContentContext = React.useContext(ActivityContentContext)
  const { infos, id } = activityContentContext
  const elements: React.ReactChild[] = []
  let totalSteps = 0
  let totalStep = 0
  if (isPopulatedArray(infos)) {
    const [info] = infos
    const { step, steps } = info
    if (isPositive(step) && isAboveZero(steps)) {
      totalStep = step
      totalSteps = steps
    }
  } else {
    const { allActivities, label } = activityContext
    if (isPopulatedString(label)) {
      elements.push(<label key="label">{label}</label>)
    }
    const active = allActivities.filter(activityObject => (
      activityObject.activityGroup === ActivityGroupActive
    ))
    if (active.length) {
      active.forEach(activityObject => {
        const { infos } = activityObject
        const [info] = infos
        assertObject(info, 'info')

        const { step, steps } = info
        if (isPositive(steps)) totalSteps += steps
        if (isPositive(step)) totalStep += step
      })
    }
  }
  
  if (totalSteps) {
    const progress = totalStep / totalSteps
    const progressProps = {
      value: progress, max: 1.0, 
      children: `${Math.round(100.0 * progress)}%`,
      key: "progress",
    }
    elements.push(<progress {...progressProps} />)
  }
  const viewProps = {
    ...props, key: 'activity-progress', children: elements
  }
  return <View { ...viewProps } />
 }