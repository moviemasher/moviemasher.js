import React from 'react'
import { PropsWithChildren, ReactResult } from '../../../declarations'

/**
 * @parents Timeline
 * @children TimelineClips
 */
function TimelineContent(props: PropsWithChildren): ReactResult {
  const { selectClass: _, ...rest } = props
  return <div {...rest} />
}

export { TimelineContent }
