import React from "react"
import { MasherAction, EventType } from "@moviemasher/moviemasher.js"
import { useListeners } from "../../Hooks/useListeners"
import { PropsAndChild, ReactResult } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"

export interface EditorRemoveButtonProps extends PropsAndChild {}

export function EditorRemoveButton(props: EditorRemoveButtonProps): ReactResult {
  const { children, ...rest } = props
  const editor = useEditor()
  const [disabled, setDisabled] = React.useState(true)
  useListeners({
    [EventType.Selection]: () => { setDisabled(!editor.can(MasherAction.Remove)) }
  })

  const onClick = () => {
    if (disabled) return

    const { clip, effect, track } = editor.selection
    if (effect) editor.removeEffect(effect)
    else if (clip) editor.removeClip(clip)
    else if (track) editor.removeTrack(track)
  }

  const cloneProps = { ...rest, onClick, disabled }
  return  React.cloneElement(React.Children.only(children), cloneProps)
}
