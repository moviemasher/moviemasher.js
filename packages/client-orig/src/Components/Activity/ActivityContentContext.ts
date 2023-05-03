
import { createContext } from '../../Framework/FrameworkFunctions'
import { ActivityGroupActive, ActivityObject } from './ActivityContext'

export const ActivityContentContextDefault: ActivityObject = {
  infos: [],
  activityGroup: ActivityGroupActive,
  id: '',
}

export const ActivityContentContext = createContext(ActivityContentContextDefault)
