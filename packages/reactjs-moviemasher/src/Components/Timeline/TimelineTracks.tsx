import React from 'react'
import { pixelPerFrame, TrackType, UnknownObject } from '@moviemasher/moviemasher.js'

import { View } from '../../View'
import { TimelineTrack } from './TimelineTrack'
// import { TimelineContext } from './TimelineContext'
import { AppContext } from '../../AppContext'
import { usePerFrame } from './usePerFrame'

const TimelineTracks:React.FC<UnknownObject> = props => {
  const appContext = React.useContext(AppContext)
  // const timelineContext = React.useContext(TimelineContext)
  const perFrame = usePerFrame()
  if (!perFrame) return null

  const { children, ...rest } = props

  const trackNodes = (): React.ReactElement[] => {
    const childNodes: React.ReactElement[] = []
    // const { width, zoom } = timelineContext
    // if (!width) return childNodes

    // const { timeRange, quantize } = appContext
    // console.log("TimelineTracks quantize", quantize, "timeRange", timeRange)
    // const mashTimeRange = timeRange.scale(quantize)
    // const perFrame = pixelPerFrame(mashTimeRange.frames, width, zoom)
    // console.log("TimelineTracks.trackNodes perFrame", perFrame)
    const kid = React.Children.only(children)
    if (!React.isValidElement(kid)) throw `Timeline.Tracks`
    // const shared = {
    //   ...props,
    //   perFrame,
    // }

    for (let i = appContext.videoTracks - 1; i >= 0; i--) {
      const trackProps = {
        ...props,
        key: `video-track-${i}`,
        index: i,
        type: TrackType.Video,
        children: React.cloneElement(kid),
      }
      childNodes.push(<TimelineTrack {...trackProps} />)
    }

    for (let i = 0; i < appContext.audioTracks; i++) {
      const trackProps = {
        ...props,
        key: `audio-track-${i}`,
        index: i,
        type: TrackType.Audio,
        children: React.cloneElement(kid),
      }
      childNodes.push(<TimelineTrack {...trackProps} />)
    }
    return childNodes
  }

  const viewProps : UnknownObject = {
    ...rest,
    children: trackNodes(),
  }

  return <View {...viewProps}/>
}

export { TimelineTracks }
