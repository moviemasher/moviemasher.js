import React from "react"
import {
  MasherAction, EventType, assertMashMedia,
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"
import { useClient } from "../../Hooks/useClient"
import { WriteOperation } from "@moviemasher/client-core"

export function SaveControl(props:PropsAndChild): ReactResult {
  const editor = useEditor()
  const client = useClient()

  const getDisabled = () => !editor.can(MasherAction.Save)
  const [disabled, setDisabled] = React.useState(getDisabled)

  const updateDisabled = () => { setDisabled(getDisabled()) }
  useListeners({
    [EventType.Action]: updateDisabled, 
    [EventType.Save]: updateDisabled,
  })

  if (!client.enabled(WriteOperation)) return null

  const { children, ...rest } = props
  
  const onClick = () => {
    if (disabled) return

    setDisabled(true)
    const { mashMedia } = editor
    assertMashMedia(mashMedia)
    
    client.save(mashMedia)
  }
  
  const buttonOptions = { ...rest, onClick, disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}
