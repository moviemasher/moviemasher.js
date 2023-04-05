import React from 'react'
import { Identified } from '@moviemasher/lib-core'

import { useContext } from "../../Framework/FrameworkFunctions"

import { PropsAndChild, PropsWithChildren } from "../../Types/Props"
import { ActivityContext, assertActivityGroup } from './ActivityContext'
import Show from '../../Framework/Show/Show.lite'

export interface ActivityPickedProps extends Identified, PropsAndChild {}

/**
 * @parents ActivityContent
 */
export default function ActivityPicked(props: ActivityPickedProps) {
  const activityContext = useContext(ActivityContext)
  return <Show 
    when={props.id === activityContext.picked}
  >{props.children}</Show>
}
