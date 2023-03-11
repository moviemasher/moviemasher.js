
import { createContext } from '../../Framework/FrameworkFunctions'
import { ActivityGroup, ActivityObject } from './ActivityContext'

export const ActivityContentContextDefault: ActivityObject = {
  infos: [],
  activityGroup: ActivityGroup.Active,
  id: '',
}

export const ActivityContentContext = createContext(ActivityContentContextDefault)
