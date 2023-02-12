import React from "react"
import {
  EventType, MasherAction} from "@moviemasher/moviemasher.js"

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
    [EventType.Loaded]: updateDisabled,
    [EventType.Save]: updateDisabled,
  })

  const onClick = () => {
    if (disabled) return

    editor.create()
  }

  const buttonOptions = { ...rest, onClick, disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)


}
