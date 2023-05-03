import React from "react"

import type { PropsClickable } from "../../Types/Props"

import {
  ClientActionSave, EventTypeAction, EventTypeLoaded, EventTypeSave
} from "@moviemasher/lib-core"

import { useMasher } from "../../Hooks/useMasher"
import { useListeners } from "../../Hooks/useListeners"
import { className } from "@moviemasher/client-core"
import Clickable from "../Clickable/Clickable.lite"

export function CreateEditedControl(props: PropsClickable) {
  const { children, ...rest } = props
  const editor = useMasher()
  const getDisabled = () => editor.can(ClientActionSave)
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled()) }

  useListeners({
    [EventTypeAction]: updateDisabled,
    [EventTypeLoaded]: updateDisabled,
    [EventTypeSave]: updateDisabled,
  })

  return <Clickable key='create-edited'
    button={props.button}
    label={props.label}
    onClick={ () => {
      if (disabled) return

      editor.create()
    } }
    className={className(disabled, props.className)}
  >{props.children}</Clickable>
}
