import React from 'react'
import { ClassButton, ClassDisabled, ClassSelected, EventType } from '@moviemasher/lib-core'


import { WithClassName } from "../../Types/Core"
import { PropsAndChild } from "../../Types/Props"
import { TimelineContext } from './TimelineContext'
import { useMasher } from '../../Hooks/useMasher'
import { useListeners } from '../../Hooks/useListeners'
import { View } from '../../Utilities/View'

export interface TimelineZoomProps extends PropsAndChild, WithClassName {
  zoom: number
}

/**
 * @parents Timeline
 */
export function TimelineZoom(props: TimelineZoomProps) {
  const masher = useMasher()
  const { zoom, className } = props
  const timelineContext = React.useContext(TimelineContext)
  const getDisabled = () => !masher.mashMedia
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled())}
  useListeners({ [EventType.Loaded]: updateDisabled })

  const classes = [ClassButton]
  if (className) classes.push(className)
  if (disabled) classes.push(ClassDisabled)

  return <View
    key='timeline-zoom'
    className={classes.join(' ')}
    onClick={() => { timelineContext.setZoom(zoom) }}
   >{ props.children }</View>

  
}
