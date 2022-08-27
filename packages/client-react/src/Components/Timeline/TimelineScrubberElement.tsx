import React from "react"
import { pixelFromFrame } from "@moviemasher/moviemasher.js"

import { PropsWithChildren, ReactResult } from "../../declarations"
import { TimelineContext } from "./TimelineContext"
import { EditorContext } from "../../Components/Masher/EditorContext"
import { View } from "../../Utilities/View"

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
