import React from 'react'
import {
  elementScrollMetrics,
  UnknownObject,
} from '@moviemasher/moviemasher.js'

import { View } from '../View'
import { TimelineContext, TimelineContextInterface, TimelineContextProvider } from './Timeline/TimelineContext'
import { Scrub } from './Timeline/Scrub'
import { ZoomSlider } from './Timeline/ZoomSlider'
import { TimelineTracks } from './Timeline/TimelineTracks'
import { TimelineClips } from './Timeline/TimelineClips'

interface TimelineProps extends UnknownObject {
  children : React.ReactNode
}

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
    console.log("TimelineSizer", metrics)

    const { setWidth, setHeight } = timelineContext
    setWidth(metrics.width)
    setHeight(metrics.height)
  }

  const [resizeObserver] = React.useState(new ResizeObserver(changeTimelineMetrics))

  React.useEffect(() => {
    const { current } = reference || {}
    if (current) resizeObserver.observe(current)
    else console.error("Timeline.useEffect no reference.current")
    return () => { resizeObserver.disconnect() }
  }, [])

  const viewProps = {
    ...props,
    ref: reference
  }

  return <View {...viewProps}/>
}

interface TimelineComposition {
  Scrub: typeof Scrub
  Zoom: typeof ZoomSlider
  Tracks: typeof TimelineTracks
  Clips: typeof TimelineClips
  Sizer: typeof TimelineSizer
}

const Timeline: React.FC<TimelineProps> & TimelineComposition = props => {
  const [zoom, setZoom] = React.useState(0)
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)

  const doSetHeight = (height : number) => {
    setHeight(height)
    setContext(old => {
      old.height = height
      return old
    })
  }
  const doSetWidth = (width : number) => {
    setWidth(width)
    setContext(old => {
      old.width = width
      return old
    })
  }
  const doSetZoom = (zoom: number) => {
    console.log("doSetZoom", zoom)
    setZoom(zoom)
    setContext(old => {
      old.zoom = zoom
      console.log("setContext", zoom, old)
      return { ...old }
    })
  }

  const [context, setContext] = React.useState(() => {
    const object: TimelineContextInterface = {
      setZoom: doSetZoom,
      setWidth: doSetWidth,
      setHeight: doSetHeight,
      zoom,
      width,
      height,
    }
    return object
  })



  const { children, ...rest } = props

  return <View {...rest}><TimelineContextProvider value={context} children={children} /></View>
}

Timeline.Scrub = Scrub
Timeline.Zoom = ZoomSlider
Timeline.Tracks = TimelineTracks
Timeline.Clips = TimelineClips
Timeline.Sizer = TimelineSizer

export { Timeline, TimelineProps }
