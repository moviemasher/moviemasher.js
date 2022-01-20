import React from "react"
import { TrackType } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useMashEditor } from "../../Hooks/useMashEditor"

interface EditorAddTrackButtonProps extends PropsAndChild { trackType: string }

function EditorAddTrackButton(props:EditorAddTrackButtonProps): ReactResult {
  const masher = useMashEditor()
  const { trackType, children, ...rest } = props
  const onClick = () => { masher.addTrack(trackType as TrackType) }
  return  React.cloneElement(React.Children.only(children), { ...rest, onClick })
}

export { EditorAddTrackButton, EditorAddTrackButtonProps }
