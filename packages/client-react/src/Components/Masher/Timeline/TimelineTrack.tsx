import React from 'react'
import { UnknownObject, TrackType } from '@moviemasher/moviemasher.js'

import { TrackContextInterface, TrackContext } from '../../../Contexts/TrackContext'
import { PropsAndChild, ReactResult } from '../../../declarations'

interface TimelineTrackProps extends UnknownObject, PropsAndChild {
  layer: number
  trackType: TrackType
}

/**
 * @parents TimelineTracks
 */
function TimelineTrack(props: TimelineTrackProps): ReactResult {
  const { layer, trackType, children } = props
  const context : TrackContextInterface = { layer, trackType }
  return <TrackContext.Provider value={context} children={children} />
}

export { TimelineTrack, TimelineTrackProps }
