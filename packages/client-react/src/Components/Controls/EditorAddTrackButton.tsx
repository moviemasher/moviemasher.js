import React from "react"
import { TrackType, UnknownObject } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult, WithClassName } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"

export interface TimelineTrackAddControlProps extends PropsAndChild, WithClassName {
  
}

export function TimelineTrackAddControl(props:TimelineTrackAddControlProps): ReactResult {
  const editor = useEditor()
  const { children, ...rest } = props
  const cloneProps: UnknownObject = { 
    ...rest, 
    disabled: !editor.selection.mash,
  }
  cloneProps.onClick = () => { editor.addTrack(TrackType.Video) }
  return React.cloneElement(React.Children.only(children), cloneProps)
}
