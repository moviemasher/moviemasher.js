import React from "react"
import { MasherAction, EventType } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useListeners } from "../../Hooks/useListeners"
import { useEditor } from "../../Hooks/useEditor"

export interface EditorRedoButtonProps extends PropsAndChild {}

export function EditorRedoButton(props: EditorRedoButtonProps): ReactResult {

  const [disabled, setDisabled] = React.useState(true)
  const editor = useEditor()
  useListeners({
    [EventType.Action]: () => { setDisabled(!editor.can(MasherAction.Redo)) }
  })
  const { children, ...rest } = props
  const onClick = () => { editor.redo() }

  const buttonOptions = { ...rest, onClick, disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}
