import React from "react"
import { MasherAction, EventType } from "@moviemasher/moviemasher.js"

import { useListeners } from "../../Hooks/useListeners"
import { PropsAndChild, ReactResult } from "../../declarations"
import { useMashEditor } from "../../Hooks/useMashEditor"

export interface EditorSplitButtonProps extends PropsAndChild {}

export function EditorSplitButton(props: EditorSplitButtonProps): ReactResult {
  const masher = useMashEditor()
  const [disabled, setDisabled] = React.useState(true)
  const resetDisabled = () => {
    setDisabled(!masher.can(MasherAction.Split))
  }
  useListeners({
    [EventType.Action]: resetDisabled,
    [EventType.Selection]: resetDisabled,
    [EventType.Time]: resetDisabled,
  })
  const { children, ...rest } = props

  const onClick = () => { masher.split() }

  const buttonOptions = { ...rest, onClick, disabled: disabled }
  return  React.cloneElement(React.Children.only(children), buttonOptions)
}
