import React from 'react'
import { UnknownObject, TrackType } from '@moviemasher/moviemasher.js'

import { TrackContextInterface, TrackContext } from '../../Contexts/TrackContext'
import { OnlyChildProps } from '../../declarations'

interface TimelineTrackProps extends UnknownObject, OnlyChildProps {
  layer: number
  trackType: TrackType
}

const TimelineTrack = (props: TimelineTrackProps) => {
  const { layer, trackType, children } = props
  const context : TrackContextInterface = { layer, trackType }
  return <TrackContext.Provider value={context} children={children} />
}

export { TimelineTrack }
