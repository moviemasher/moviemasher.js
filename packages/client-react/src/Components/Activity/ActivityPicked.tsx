import React from 'react'
import { Identified, assertTrue } from '@moviemasher/moviemasher.js'

import { PropsAndChild, ReactResult } from '../../declarations'
import { Problems } from '../../Setup/Problems'
import { ActivityContext, assertActivityGroup } from './ActivityContext'

export interface ActivityPickedProps extends Identified, PropsAndChild {}

/**
 * @parents ActivityContent
 */
export function ActivityPicked(props: ActivityPickedProps): ReactResult {
  const activityContext = React.useContext(ActivityContext)
  const { id, children } = props
  assertActivityGroup(id)

  const { picked } = activityContext
  if (id !== picked) return null

  const child = React.Children.only(children)
  assertTrue(React.isValidElement(child), Problems.child)

  return child
  // return React.cloneElement(child, { key: id })
}
