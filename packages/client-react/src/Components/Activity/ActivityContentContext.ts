import React from 'react'

import { ActivityGroup, ActivityObject } from './ActivityContext'

export const ActivityContentContextDefault: ActivityObject = {
  infos: [],
  activityGroup: ActivityGroup.Active,
  id: '',
}

export const ActivityContentContext = React.createContext(ActivityContentContextDefault)
