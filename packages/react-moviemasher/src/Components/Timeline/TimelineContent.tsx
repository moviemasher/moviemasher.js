import React from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'

const TimelineContent: React.FunctionComponent<UnknownObject> = props => {
  const { selectClass: _, ...rest } = props
  return <div {...rest} />
}

export { TimelineContent }
