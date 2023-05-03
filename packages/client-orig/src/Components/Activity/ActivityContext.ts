
import { 
  EmptyFunction, isPopulatedString, errorThrow, Identified,
} from '@moviemasher/lib-core'

import { createContext } from '../../Framework/FrameworkFunctions'
import { ActivityInfo } from '../../Types/Core'

export type ActiveActivityGroup = 'active' 
export type ErrorActivityGroup = 'error'
export type CompleteActivityGroup = 'complete'
export type ActivityGroup = ActiveActivityGroup | ErrorActivityGroup | CompleteActivityGroup

export const ActivityGroupActive: ActivityGroup = 'active'
export const ActivityGroupError: ActivityGroup = 'error'
export const ActivityGroupComplete: ActivityGroup = 'complete'

export const ActivityGroups = [ActivityGroupActive, ActivityGroupError, ActivityGroupComplete]
export const isActivityGroup = (type?: any): type is ActivityGroup => {
  return isPopulatedString(type) && ActivityGroups.includes(type as ActivityGroup)
}
export function assertActivityGroup(value: any, name?: string): asserts value is ActivityGroup {
  if (!isActivityGroup(value)) errorThrow(value, "ActivityGroup", name)
}

export interface ActivityObject extends Identified {
  infos: ActivityInfo[]
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
  picked: ActivityGroupActive,
  pick: EmptyFunction
}

export const ActivityContext = createContext(ActivityContextDefault)
