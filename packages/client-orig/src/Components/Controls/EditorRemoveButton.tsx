import React from "react"

import /* type */ { PropsClickable } from "../../Types/Props"

import { 
  assertSelectorType, ClipType, EventType, isClip, isEffect, isTrack 
} from "@moviemasher/moviemasher.js"
import { useListeners } from "../../Hooks/useListeners"
import { useMasher } from "../../Hooks/useMasher"
import { className } from "@moviemasher/client-core"
import Clickable from "../Clickable/Clickable.lite"

export interface EditorRemoveButtonProps extends PropsClickable {
  type: string
}


export function EditorRemoveButton(props: EditorRemoveButtonProps) {
  const { type = ClipType } = props
  assertSelectorType(type)

  const masher = useMasher()
  const getDisabled = () => !masher.selection[type]
  const [disabled, setDisabled] = React.useState(getDisabled)
  useListeners({
    [EventType.Selection]: () => { setDisabled(getDisabled()) }
  })

  return <Clickable key='remove'
    button={props.button}
    label={props.label}
    onClick={ () => {
      if (disabled) return

      const selectable = masher.selection[type]
      if (isEffect(selectable)) masher.removeEffect(selectable)
      else if (isClip(selectable)) masher.removeClip(selectable)
      else if (isTrack(selectable)) masher.removeTrack(selectable)
    } }
    className={ className(disabled, props.className) }
  >{props.children}</Clickable>
}
