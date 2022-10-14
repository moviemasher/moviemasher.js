import React from "react"
import { DefaultContentId, EditorIndex, EventType, UnknownObject } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult, WithClassName } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"
import { MasherContext } from "../Masher/MasherContext"

export interface TimelineAddClipControlProps extends PropsAndChild, WithClassName {}

export function TimelineAddClipControl(props:TimelineAddClipControlProps): ReactResult {
  const editor = useEditor()
  const editorContext = React.useContext(MasherContext)
  const { definition, drop } = editorContext
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
    const { selection, edited } = editor
    const { clip, track } = selection
    const object = definition?.toJSON() || { id: DefaultContentId }
    const editorIndex: EditorIndex = {
      clip: 0, track: -1
    }
    if (clip && track) {
      editorIndex.clip = track.dense ? track.clips.indexOf(clip) : clip.endFrame
      editorIndex.track = track.index
    } else {
      editorIndex.clip = editor.time.scale(edited!.quantize).frame
    }
    drop(object, editorIndex)
  }
  return React.cloneElement(React.Children.only(children), cloneProps)
}
