import React from "react"
import { EventType, pixelFromFrame } from "@moviemasher/moviemasher.js"

import { View } from "../../../Utilities/View"
import { useMashScale } from "../../../Hooks/useMashScale"
import { useListeners } from "../../../Hooks/useListeners"
import { PropsWithChildren, ReactResult } from "../../../declarations"
import { useMashEditor } from "../../../Hooks/useMashEditor"

export interface TimelineScrubberElementProps extends PropsWithChildren {}
/**
 * @parents Timeline
 */
export function TimelineScrubberElement(props: TimelineScrubberElementProps): ReactResult {
  const masher = useMashEditor()
  const scale = useMashScale()
  useListeners({
    [EventType.Time]: () => { setFrame(masher.mash.frame) }
  })
  const [frame, setFrame] = React.useState(masher.mash.frame)

  const left = pixelFromFrame(frame, scale)

  const iconProps = { ...props, key: 'timeline-icon', style: { left } }

  return <View {...iconProps} />
}
