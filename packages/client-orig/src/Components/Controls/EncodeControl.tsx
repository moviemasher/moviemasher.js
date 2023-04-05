
import React from "react"

import type { PropsClickable } from "../../Types/Props"

import {
  EventType, MasherAction, assertMashMedia, assertEncodingType, isEncodingType
} from "@moviemasher/lib-core"
import { className, EncodeOperation } from "@moviemasher/client-core"

import { useMasher } from "../../Hooks/useMasher"
import { useListeners } from "../../Hooks/useListeners"
import { useClient } from "../../Hooks/useClient"
import Clickable from "../Clickable/Clickable.lite"

export function EncodeControl(props: PropsClickable) {
  const client = useClient()
  const masher = useMasher()

  const getVisible = () => {
    if (!client.enabled(EncodeOperation)) return false

    const { mashMedia } = masher
    if (!mashMedia) return false

    const { kind } = mashMedia
    return isEncodingType(kind)
  }
  const [visible, setVisible] = React.useState(getVisible)
  const getDisabled = () => !masher.can(MasherAction.Render)
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => setDisabled(getDisabled())
  const updateVisible = () => setVisible(getVisible())
  const updateBoth = () => { 
    updateVisible() 
    updateDisabled()
  }

  useListeners({
    [EventType.Save]: updateDisabled,
    [EventType.Loaded]: updateBoth,
    [EventType.Action]: updateDisabled
  })

  if (!visible) return null

  return <Clickable key='encode'
    button={props.button}
    label={props.label}
    className={ className(disabled, props.className) }
    onClick={ () => {
      if (disabled) return

      const { mashMedia } = masher
      assertMashMedia(mashMedia)

      const { kind } = mashMedia
      assertEncodingType(kind)

      setDisabled(true)
      client.encode({ media: mashMedia, type: kind })
    } }
  >{props.children}</Clickable>
    
}
