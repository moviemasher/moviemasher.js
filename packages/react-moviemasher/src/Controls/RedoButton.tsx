import React from "react"
import { MasherAction, EventType } from "@moviemasher/moviemasher.js"

import { OnlyChildProps } from "../declarations"
import { useListeners } from "../Hooks/useListeners"

const RedoButton: React.FunctionComponent<OnlyChildProps> = props => {
  const [disabled, setDisabled] = React.useState(true)
  const editorContext = useListeners({
    [EventType.Action]: masher => { setDisabled(!masher.can(MasherAction.Redo)) }
  })
  const { children, ...rest } = props
  const { masher } = editorContext
  const onClick = () => { masher.redo() }

  const buttonOptions = { ...rest, onClick, disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}

export { RedoButton }
