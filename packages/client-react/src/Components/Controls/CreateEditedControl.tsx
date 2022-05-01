import React from "react"
import {
  EventType, MasherAction, mashInstance, Described
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"

export function CreateEditedControl(props: PropsAndChild): ReactResult {
  const { children, ...rest } = props
  const editor = useEditor()
  const getDisabled = () => editor.can(MasherAction.Save)
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled()) }

  useListeners({
    [EventType.Action]: updateDisabled,
    [EventType.Mash]: updateDisabled,
    [EventType.Save]: updateDisabled,
  })

  const onClick = () => {
    if (disabled) return

    editor.clear()
  }

  const buttonOptions = { ...rest, onClick, disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)


}
