import React from 'react'

import { TrackContext } from '../../Contexts/TrackContext'

interface TrackIsTypeProps {
  type: string
}

const TrackIsType: React.FunctionComponent<TrackIsTypeProps> = props => {
  const trackContext = React.useContext(TrackContext)

  const { type, children } = props
  if (!children) return null

  const { trackType } = trackContext
  if (trackType !== type) return null

  return <>{children}</>
}

export { TrackIsType }
