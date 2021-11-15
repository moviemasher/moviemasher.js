import React from 'react'

import { View } from '../../Utilities/View'
import { TimelineContext, TimelineContextInterface } from './TimelineContext'
import { Panel } from '../../declarations'

const TimelinePanel: Panel = props => {
  const [zoom, setZoom] = React.useState(0)
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


export { TimelinePanel }
