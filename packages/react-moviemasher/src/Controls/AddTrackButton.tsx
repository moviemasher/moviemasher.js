import React from "react"
import { TrackType } from "@moviemasher/moviemasher.js"

import { EditorContext } from "../Contexts/EditorContext"
import { OnlyChildProps } from "../declarations"

interface AddTrackButtonProps extends OnlyChildProps { trackType: string }

const AddTrackButton: React.FunctionComponent<AddTrackButtonProps> = props => {
  const editorContext = React.useContext(EditorContext)
  const { masher } = editorContext
  const { trackType, children, ...rest } = props
  const onClick = () => { masher.addTrack(trackType as TrackType) }
  return  React.cloneElement(React.Children.only(children), { ...rest, onClick })
}

export { AddTrackButton }
