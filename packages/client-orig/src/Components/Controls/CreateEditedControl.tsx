import React from "react"

import type { PropsClickable } from "../../Types/Props"

import {
  EventType, MasherAction
} from "@moviemasher/lib-core"

import { useMasher } from "../../Hooks/useMasher"
import { useListeners } from "../../Hooks/useListeners"
import { className } from "@moviemasher/client-core"
import Clickable from "../Clickable/Clickable.lite"

export function CreateEditedControl(props: PropsClickable) {
  const { children, ...rest } = props
  const editor = useMasher()
  const getDisabled = () => editor.can(MasherAction.Save)
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled()) }

  useListeners({
    [EventType.Action]: updateDisabled,
    [EventType.Loaded]: updateDisabled,
    [EventType.Save]: updateDisabled,
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
