import React from 'react'

import { TrackContext } from '../../../Contexts/TrackContext'
import { PropsWithChildren, ReactResult } from '../../../declarations'

export interface TimelineTrackIsTypeProps extends PropsWithChildren {
  type: string
}

/**
 * @parents TimelineContent
 */
export function TimelineTrackIsType(props: TimelineTrackIsTypeProps): ReactResult {
  const trackContext = React.useContext(TrackContext)

  const { type, children } = props
  if (!children) return null

  const { trackType } = trackContext
  if (trackType !== type) return null

  return <>{children}</>
}
