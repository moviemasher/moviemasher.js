import React from "react"
import { EventType, UnknownObject } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult, WithClassName } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"

export interface TimelineAddTrackControlProps extends PropsAndChild, WithClassName {}

export function TimelineAddTrackControl(props:TimelineAddTrackControlProps): ReactResult {
  const editor = useEditor()
  const getDisabled = () => !editor.selection.mash
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled())}
  useListeners({ [EventType.Selection]: updateDisabled })
  
  const { children, ...rest } = props
  const cloneProps: UnknownObject = { 
    ...rest, 
    disabled,
  }
  cloneProps.onClick = () => { editor.addTrack() }
  return React.cloneElement(React.Children.only(children), cloneProps)
}
