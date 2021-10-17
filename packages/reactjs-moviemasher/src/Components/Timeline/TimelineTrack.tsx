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
  // perFrame: number
}

const TimelineTrack = (props: TimelineTrackProps) => {
  const { index, type, children } = props
  const [context, setContext] = React.useState(() => {
    const object: TrackContextInterface = { index, type }
    return object
  })

  // console.log("TimelineTrack perFrame", perFrame)

  return <TrackContextProvider value={context} children={children} />
}

export { TimelineTrack }
