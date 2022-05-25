import React from "react"
import { MasherAction, EventType } from "@moviemasher/moviemasher.js"

import { useListeners } from "../../Hooks/useListeners"
import { PropsAndChild, ReactResult } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"

export interface EditorUndoButtonProps extends PropsAndChild {}

export function EditorUndoButton(props: EditorUndoButtonProps): ReactResult {
  const editor = useEditor()
  const [disabled, setDisabled] = React.useState(true)
  useListeners({
    [EventType.Action]: () => { setDisabled(!editor.can(MasherAction.Undo)) }
  })
  const { children, ...rest } = props

  const onClick = () => { editor.undo() }

  const buttonOptions = { ...rest, onClick, disabled: disabled }
  return  React.cloneElement(React.Children.only(children), buttonOptions)
}
