import React from "react"
import { assertPopulatedString, DefaultContentId, EditorIndex, EventType, UnknownRecord } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult, WithClassName } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"
import { MasherContext } from "../Masher/MasherContext"

export interface TimelineAddClipControlProps extends PropsAndChild, WithClassName {}

export function TimelineAddClipControl(props:TimelineAddClipControlProps): ReactResult {
  const editor = useEditor()
  const editorContext = React.useContext(MasherContext)
  const { current, drop } = editorContext
  const getDisabled = () => !editor.selection.mash
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled())}
  useListeners({ [EventType.Selection]: updateDisabled })
  
  const { children, ...rest } = props
  const cloneProps: UnknownRecord = { 
    ...rest, 
    disabled,
  }
  cloneProps.onClick = () => { 
    const { selection, mashMedia } = editor
    const { clip, track } = selection
    const id = current.mediaId || DefaultContentId
    assertPopulatedString(id)
    const object = { id }
    const editorIndex: EditorIndex = {
      clip: 0, track: -1
    }
    if (clip && track) {
      editorIndex.clip = track.dense ? track.clips.indexOf(clip) : clip.endFrame
      editorIndex.track = track.index
    } else {
      editorIndex.clip = editor.time.scale(mashMedia!.quantize).frame
    }
    drop(object, editorIndex)
  }
  return React.cloneElement(React.Children.only(children), cloneProps)
}
