import React from "react"
import { MasherAction, EventType } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useListeners } from "../../Hooks/useListeners"
import { useMashEditor } from "../../Hooks/useMashEditor"

export interface EditorRedoButtonProps extends PropsAndChild {}

export function EditorRedoButton(props: EditorRedoButtonProps): ReactResult {

  const [disabled, setDisabled] = React.useState(true)
  const masher = useMashEditor()
  useListeners({
    [EventType.Action]: () => { setDisabled(!masher.can(MasherAction.Redo)) }
  })
  const { children, ...rest } = props
  const onClick = () => { masher.redo() }

  const buttonOptions = { ...rest, onClick, disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}
