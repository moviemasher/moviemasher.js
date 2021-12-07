import React from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'

import { View } from "../../Utilities/View"
import { TimelineContext } from "../../Contexts/TimelineContext"

const TimelineSizer: React.FC<UnknownObject> = props => {
  const ref = React.useRef<HTMLDivElement>(null)
  const timelineContext = React.useContext(TimelineContext)
  const handleResize = () => {
    const { current } = ref
    if (!current) throw "TimelineSizer no ref.current"

    const rect = current.getBoundingClientRect()
    const { setWidth, setHeight } = timelineContext
    setWidth(rect.width)
    setHeight(rect.height)
  }

  const [resizeObserver] = React.useState(new ResizeObserver(handleResize))

  React.useEffect(() => {
    const { current } = ref
    if (current) resizeObserver.observe(current)
    return () => { resizeObserver.disconnect() }
  }, [])

  const viewProps = { ...props, ref }
  return <View {...viewProps}/>
}

export { TimelineSizer }
