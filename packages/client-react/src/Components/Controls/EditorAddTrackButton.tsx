import React from "react"
import { TrackType, UnknownObject } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult, WithClassName } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"

export interface TimelineTrackAddControlProps extends PropsAndChild, WithClassName {
  trackType: string
}

export function TimelineTrackAddControl(props:TimelineTrackAddControlProps): ReactResult {
  const editor = useEditor()
  const { trackType, children, ...rest } = props
  const cloneProps: UnknownObject = { ...rest }
  cloneProps.onClick = () => { editor.addTrack(trackType as TrackType) }
  return  React.cloneElement(React.Children.only(children), cloneProps)
}
