import React from "react"
import {
  MasherAction, EventType,
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"
import { MasherContext } from "../Masher/MasherContext"

export function SaveControl(props:PropsAndChild): ReactResult {
  const editor = useEditor()
  const editorContext = React.useContext(MasherContext)

  const { save } = editorContext
  
  const getDisabled = () => !editor.can(MasherAction.Save)
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled()) }
  useListeners({
    [EventType.Action]: updateDisabled, [EventType.Save]: updateDisabled,
  })
  const { children, ...rest } = props
  
  const onClick = () => {
    if (disabled) return

    setDisabled(true)
    save()
  }
  
  const buttonOptions = { ...rest, onClick, disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}
