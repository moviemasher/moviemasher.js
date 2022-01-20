import React from "react"
import { MasherAction, EventType } from "@moviemasher/moviemasher.js"
import { useListeners } from "../../Hooks/useListeners"
import { PropsAndChild, ReactResult } from "../../declarations"
import { useMashEditor } from "../../Hooks/useMashEditor"

interface EditorRemoveButtonProps extends PropsAndChild {}
function EditorRemoveButton(props:EditorRemoveButtonProps): ReactResult {
  const [disabled, setDisabled] = React.useState(true)
  const masher = useMashEditor()
  useListeners({
    [EventType.Selection]: () => { setDisabled(!masher.can(MasherAction.Remove)) }
  })

  const { children, ...rest } = props

  const onClick = () => {
    if (disabled) return

    const { clip, effect, track } = masher.selection
    if (effect) masher.removeEffect(effect)
    else if (clip) masher.removeClip(clip)
    else if (track) masher.removeTrack(track)
  }

  const buttonOptions = { ...rest, onClick, disabled }
  return  React.cloneElement(React.Children.only(children), buttonOptions)
}

export { EditorRemoveButton, EditorRemoveButtonProps }
