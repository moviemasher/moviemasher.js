import React from 'react'
import { 
  ActivityInfo, EmptyMethod, isObject, isPopulatedString, errorsThrow,
} from '@moviemasher/moviemasher.js'

import { labelInterpolate, labelTranslate } from '../../Utilities/Label'

export const activityLabel = (info: any): string => {
  if (!isObject(info)) return ''

  const { label, error, type, value } = info as ActivityInfo
  if (error) {
    if (value) return labelInterpolate(error, { value })
    return labelTranslate(error)
  }

  // switch(type) {
  //   case ActivityType.Complete:
  //   case ActivityType.Analyze:
  //   case ActivityType.Render:
  //   case ActivityType.Load: return labelTranslate(type)
    
  // }

  // if (label) return label
  return labelTranslate(type)
}

export enum ActivityGroup {
  Active = 'active',
  Error = 'error',
  Complete = 'complete',
}
export const ActivityGroups = Object.values(ActivityGroup)
export const isActivityGroup = (type?: any): type is ActivityGroup => {
  return isPopulatedString(type) && ActivityGroups.includes(type as ActivityGroup)
}
export function assertActivityGroup(value: any, name?: string): asserts value is ActivityGroup {
  if (!isActivityGroup(value)) errorsThrow(value, "ActivityGroup", name)
}

export interface ActivityObject {
  infos: ActivityInfo[]
  id: string
  activityGroup: ActivityGroup
}
export type ActivityObjects = ActivityObject[]

export interface ActivityContextInterface {
  label: string
  activities: ActivityObjects
  allActivities: ActivityObjects
  picked: ActivityGroup
  pick: (activityGroup: ActivityGroup) => void
}

export const ActivityContextDefault: ActivityContextInterface = {
  label: '',
  activities: [],
  allActivities: [],
  picked: ActivityGroup.Active,
  pick: EmptyMethod
}

export const ActivityContext = React.createContext(ActivityContextDefault)
