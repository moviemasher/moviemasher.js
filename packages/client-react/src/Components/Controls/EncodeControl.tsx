import React from "react"
import {
  EventType, MasherAction, assertMashMedia
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"
import { EncodeOperation } from "@moviemasher/client-core"
import { useClient } from "../../Hooks/useClient"

export function EncodeControl(props: PropsAndChild): ReactResult {
  const client = useClient()
  const { children, ...rest } = props
  const editor = useEditor()

  const getDisabled = () => !editor.can(MasherAction.Render)
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => setDisabled(getDisabled())
  useListeners({
    [EventType.Save]: updateDisabled,
    [EventType.Loaded]: updateDisabled,
    [EventType.Action]: updateDisabled
  })

  if (!client.enabled(EncodeOperation)) return null

  const onClick = () => {
    if (disabled) return

    const { mashMedia } = editor
    assertMashMedia(mashMedia)

    setDisabled(true)
    client.encode(mashMedia)
  }
  const buttonOptions = { ...rest, onClick, disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}
