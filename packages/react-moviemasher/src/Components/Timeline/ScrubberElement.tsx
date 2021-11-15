import React from "react"
import { EventType, pixelFromFrame, UnknownObject } from "@moviemasher/moviemasher.js"

import { View } from "../../Utilities/View"
import { useMashScale } from "./useMashScale"
import { useListeners } from "../../Hooks/useListeners"

const ScrubberElement: React.FC<UnknownObject> = (props) => {
  const scale = useMashScale()
  const { masher } = useListeners({
    [EventType.Time]: masher => { setFrame(masher.mash.frame) }
  })
  const [frame, setFrame] = React.useState(masher.mash.frame)

  const left = pixelFromFrame(frame, scale)

  const iconProps = { ...props, key: 'timeline-icon', style: { left } }

  return <View {...iconProps} />
}

export { ScrubberElement }
