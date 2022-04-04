import React from 'react'

import { View } from '../../../Utilities/View'
import { TimelineContext, TimelineContextInterface } from '../../../Contexts/TimelineContext'
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { ReactResult } from '../../../declarations'

interface TimelineProps extends UnknownObject {
  children: React.ReactNode
}

/**
 * @parents Masher
 * @children TimelineContent, TimelineZoomer, TimelineScrubber, TimelineScrubberElement, TimelineSizer
 */
function Timeline(props: TimelineProps): ReactResult {
  const [zoom, setZoom] = React.useState(1.0)
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)

  const timelineContext : TimelineContextInterface = {
    setZoom,
    setWidth,
    setHeight,
    zoom,
    width,
    height,
  }
  const { children, ...rest } = props

  return <View {...rest}>
    <TimelineContext.Provider value={timelineContext} children={children} />
  </View>
}


export { Timeline, TimelineProps }
