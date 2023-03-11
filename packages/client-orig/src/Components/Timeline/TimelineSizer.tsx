import React from 'react'

import { View } from "../../Utilities/View"
import { TimelineContext } from "./TimelineContext"

import { PropsWithChildren } from "../../Types/Props"

/**
 * @parents Timeline
 */
export function TimelineSizer(props: PropsWithChildren) {
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
