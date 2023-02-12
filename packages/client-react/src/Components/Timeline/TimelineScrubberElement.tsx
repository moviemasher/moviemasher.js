import React from "react"

import { PropsWithChildren, ReactResult } from "../../declarations"
import { TimelineContext } from "./TimelineContext"
import { MasherContext } from "../Masher/MasherContext"
import { View } from "../../Utilities/View"
import { pixelFromFrame } from "@moviemasher/client-core"

/**
 * @parents TimelineScrubber
 */
export function TimelineScrubberElement(props: PropsWithChildren): ReactResult {
  const timelineContext = React.useContext(TimelineContext)
  const { scale, frame } = timelineContext
  const calculateViewProps = () => {
    const viewProps = { ...props, style: { left: pixelFromFrame(frame, scale) } }
    return viewProps
  }

  const viewProps = React.useMemo(calculateViewProps, [frame, scale])
  return <View {...viewProps} />
}
