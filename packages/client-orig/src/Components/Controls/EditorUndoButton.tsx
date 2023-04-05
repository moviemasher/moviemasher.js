import React from "react"


import type { PropsClickable } from "../../Types/Props"

import { MasherAction, EventType } from "@moviemasher/lib-core"

import { useListeners } from "../../Hooks/useListeners"
import { useMasher } from "../../Hooks/useMasher"
import { className } from "@moviemasher/client-core"
import Clickable from "../Clickable/Clickable.lite"


export function EditorUndoButton(props: PropsClickable) {
  const masher = useMasher()
  const [disabled, setDisabled] = React.useState(true)
  useListeners({
    [EventType.Action]: () => { setDisabled(!masher.can(MasherAction.Undo)) }
  })

  return <Clickable key='undo'
    button={props.button}
    label={props.label}
    className={className(disabled, props.className)}
    onClick={ () => masher.undo() }
  >{props.children}</Clickable>
}
