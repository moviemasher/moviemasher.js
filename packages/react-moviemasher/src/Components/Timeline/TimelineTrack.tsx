import React from 'react'
import {
  UnknownObject,
  TrackType,
} from '@moviemasher/moviemasher.js'

import { TrackContextInterface, TrackContextProvider } from './TrackContext'

interface TimelineTrackProps extends UnknownObject {
  index: number
  type: TrackType
  children: React.ReactElement
}

const TimelineTrack = (props: TimelineTrackProps) => {
  const { index, type, children } = props
  const context : TrackContextInterface = { index, type }
  return <TrackContextProvider value={context} children={children} />
}

export { TimelineTrack }
