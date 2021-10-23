import React from 'react'
import {
  elementScrollMetrics,
  UnknownObject,
} from '@moviemasher/moviemasher.js'

import { View } from "../../Utilities/View"
import { TimelineContext } from "./TimelineContext"

const TimelineSizer: React.FC<UnknownObject> = props => {
  const reference = React.useRef<HTMLDivElement>(null)
  const timelineContext = React.useContext(TimelineContext)
  const changeTimelineMetrics = () => {
    const { current } = reference || {}
    if (!current) {
      console.error("TimelineSizer no reference.current")
      return
    }

    const metrics = elementScrollMetrics(current)
    if (!metrics) {
      console.error("TimelineSizer no metrics")
      return
    }
    // console.log("TimelineSizer", metrics)

    const { setWidth, setHeight } = timelineContext
    setWidth(metrics.width)
    setHeight(metrics.height)
  }

  const [resizeObserver] = React.useState(new ResizeObserver(changeTimelineMetrics))

  React.useEffect(() => {
    const { current } = reference
    if (current) resizeObserver.observe(current)
    return () => { resizeObserver.disconnect() }
  }, [])

  const viewProps = {
    ...props,
    ref: reference
  }
  return <View {...viewProps}/>
}

export { TimelineSizer }
