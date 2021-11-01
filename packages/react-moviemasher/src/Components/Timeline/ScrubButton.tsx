import React from "react"
import { pixelFromFrame, UnknownObject } from "@moviemasher/moviemasher.js"
import { EditorContext } from '../Editor/EditorContext'
import { View } from "../../Utilities/View"
import { useMashScale } from "./useMashScale"

const ScrubButton: React.FC<UnknownObject> = (props) => {
  const editorContext = React.useContext(EditorContext)

  const scale = useMashScale()
  if (!scale) return null

  const { frame } = editorContext


  const left = pixelFromFrame(frame, scale)
  const iconProps = { ...props, key: 'timeline-icon', style: { left } }

  return <View {...iconProps} />
}

export { ScrubButton }
