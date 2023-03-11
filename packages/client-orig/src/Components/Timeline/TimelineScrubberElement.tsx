import React from "react"


import { PropsWithChildren } from "../../Types/Props"
import { TimelineContext } from "./TimelineContext"

import { View } from "../../Utilities/View"
import { pixelFromFrame } from "@moviemasher/client-core"


export function TimelineScrubberElement(props: PropsWithChildren) {
  const timelineContext = React.useContext(TimelineContext)
  const { scale, frame } = timelineContext
  const calculateViewProps = () => {
    const viewProps = { ...props, style: { left: pixelFromFrame(frame, scale) } }
    return viewProps
  }

  const viewProps = React.useMemo(calculateViewProps, [frame, scale])
  return <View {...viewProps} />
}
