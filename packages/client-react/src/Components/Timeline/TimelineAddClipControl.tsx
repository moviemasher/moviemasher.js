import React from "react"
import { contentDefault, EditorIndex, EventType, UnknownObject } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult, WithClassName } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"

export interface TimelineAddClipControlProps extends PropsAndChild, WithClassName {}

export function TimelineAddClipControl(props:TimelineAddClipControlProps): ReactResult {
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
  cloneProps.onClick = () => { 
    const { clip, track } = editor.selection
    const editorIndex: EditorIndex = {
      clip: 0, track: -1
    }
    if (clip && track) {
      editorIndex.clip = track.dense ? track.clips.indexOf(clip) : clip.endFrame
      editorIndex.track = track.index
    }
    editor.add({ id: contentDefault.id }, editorIndex) 
  }
  return React.cloneElement(React.Children.only(children), cloneProps)
}
