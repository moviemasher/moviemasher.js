import React from "react"
import { pixelFromFrame } from "@moviemasher/moviemasher.js"

import { PropsWithChildren, ReactResult } from "../../declarations"
import { TimelineContext } from "../../Contexts/TimelineContext"
import { EditorContext } from "../../Contexts/EditorContext"
import { View } from "../../Utilities/View"

/**
 * @parents TimelineScrubber
 */
export function TimelineScrubberElement(props: PropsWithChildren): ReactResult {
  const editorContext = React.useContext(EditorContext)
  const timelineContext = React.useContext(TimelineContext)
  const { frame } = editorContext
  const { scale } = timelineContext
  const calculateViewProps = () => {
    const viewProps = { ...props, style: { left: pixelFromFrame(frame, scale) } }
    return viewProps
  }

  const viewProps = React.useMemo(calculateViewProps, [frame, scale])
  return <View {...viewProps} />
}
