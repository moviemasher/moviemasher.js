import React from "react"
import { MasherAction, EventType, Masher } from "@moviemasher/moviemasher.js"

import { OnlyChildProps } from "../declarations"
import { useListeners } from "../Hooks/useListeners"

const SplitButton: React.FunctionComponent<OnlyChildProps> = props => {
  const [disabled, setDisabled] = React.useState(true)
  const resetDisabled = (masher: Masher) => {
    setDisabled(!masher.can(MasherAction.Split))
  }
  const editorContext = useListeners({
    [EventType.Action]: resetDisabled,
    [EventType.Selection]: resetDisabled,
    [EventType.Time]: resetDisabled,
  })
  const { children, ...rest } = props

  const { masher } = editorContext
  const onClick = () => { masher.split() }

  const buttonOptions = { ...rest, onClick, disabled: disabled }
  return  React.cloneElement(React.Children.only(children), buttonOptions)
}

export { SplitButton }
