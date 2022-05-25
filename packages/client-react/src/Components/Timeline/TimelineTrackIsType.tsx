import React from 'react'
import { isTrackType, TrackType } from '@moviemasher/moviemasher.js'

import { PropsWithChildren, ReactResult } from '../../declarations'
import { TrackContext } from '../../Contexts/TrackContext'

export interface TimelineTrackIsTypeProps extends PropsWithChildren {
  type: TrackType
}

/**
 * @parents TimelineTracks
 */
export function TimelineTrackIsType(props: TimelineTrackIsTypeProps): ReactResult {
  const trackContext = React.useContext(TrackContext)

  const { type, children } = props
  if (!children) return  null
  if (!isTrackType(type)) return null

  const { track } = trackContext
  if (track?.trackType !== type) return null

  return <>{children}</>
}
