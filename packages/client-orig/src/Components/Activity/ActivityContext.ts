
import { 
  EmptyFunction, isObject, isPopulatedString, errorThrow, Identified,
} from '@moviemasher/moviemasher.js'
import { ActivityInfo } from "@moviemasher/client-core"

import { createContext } from '../../Framework/FrameworkFunctions'

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
  picked: ActivityGroup.Active,
  pick: EmptyFunction
}

export const ActivityContext = createContext(ActivityContextDefault)
