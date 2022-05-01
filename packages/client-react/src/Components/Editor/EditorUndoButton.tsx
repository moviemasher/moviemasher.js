import React from "react"
import { MasherAction, EventType } from "@moviemasher/moviemasher.js"

import { useListeners } from "../../Hooks/useListeners"
import { PropsAndChild, ReactResult } from "../../declarations"
import { useMashEditor } from "../../Hooks/useMashEditor"

export interface EditorUndoButtonProps extends PropsAndChild {}

export function EditorUndoButton(props: EditorUndoButtonProps): ReactResult {
  const masher = useMashEditor()
  const [disabled, setDisabled] = React.useState(true)
  useListeners({
    [EventType.Action]: () => { setDisabled(!masher.can(MasherAction.Undo)) }
  })
  const { children, ...rest } = props

  const onClick = () => { masher.undo() }

  const buttonOptions = { ...rest, onClick, disabled: disabled }
  return  React.cloneElement(React.Children.only(children), buttonOptions)
}
