import React from 'react'

import { View } from "../../Utilities/View"
import { TimelineContext } from "../../Contexts/TimelineContext"
import { PropsWithChildren, ReactResult } from '../../declarations'

/**
 * @parents Timeline
 */
export function TimelineSizer(props: PropsWithChildren): ReactResult {
  const ref = React.useRef<HTMLDivElement>(null)
  const timelineContext = React.useContext(TimelineContext)
  const handleResize = () => {
    const { setRect } = timelineContext
    const rect = ref.current!.getBoundingClientRect()
    // console.log("handleResize width", rect.width)
    setRect(rect)
  }

  const [resizeObserver] = React.useState(new ResizeObserver(handleResize))

  React.useEffect(() => {
    const { current } = ref
    if (current) resizeObserver.observe(current)
    return () => { resizeObserver.disconnect() }
  }, [ref.current])

  const viewProps = { ...props, ref }
  return <View {...viewProps}/>
}
