import React from "react"

import type { PropsClickable } from "../../Types/Props"

import { ClientActionRedo, EventTypeAction } from "@moviemasher/lib-core"

import { useListeners } from "../../Hooks/useListeners"
import { useMasher } from "../../Hooks/useMasher"
import { className } from "@moviemasher/client-core"
import Clickable from "../Clickable/Clickable.lite"


export function EditorRedoButton(props: PropsClickable) {
  const [disabled, setDisabled] = React.useState(true)
  const masher = useMasher()
  useListeners({
    [EventTypeAction]: () => { setDisabled(!masher.can(ClientActionRedo)) }
  })
  
  return <Clickable key='redo'
    button={props.button}
    label={props.label}
    onClick={ () => masher.redo() }
    className={className(disabled, props.className)}
  >{props.children}</Clickable>}
