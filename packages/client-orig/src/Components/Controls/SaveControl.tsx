import React from "react"
import type { PropsClickable } from "../../Types/Props"

import { 
  assertMashMedia, isMashMedia, ClientActionSave, EventTypeAction, EventTypeLoaded, EventTypeSave 
} from "@moviemasher/lib-core"

import { OperationWrite, className } from "@moviemasher/client-core"
import { useClient } from "../../Hooks/useClient"
import { useListeners } from "../../Hooks/useListeners"
import { useMasher } from "../../Hooks/useMasher"
import Clickable from "../Clickable/Clickable.lite"

export function SaveControl(props: PropsClickable) {
  const masher = useMasher()
  const client = useClient()
  
  const getVisible = () => {
    if (!client.enabled(OperationWrite)) return false

    return isMashMedia(masher.mashMedia)
  }
  const [visible, setVisible] = React.useState(getVisible)
  const getDisabled = () => !masher.can(ClientActionSave)
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => setDisabled(getDisabled())
  const updateVisible = () => setVisible(getVisible())
  const updateBoth = () => { 
    updateVisible() 
    updateDisabled()
  }

  useListeners({
    [EventTypeAction]: updateDisabled, 
    [EventTypeLoaded]: updateBoth,
    [EventTypeSave]: updateDisabled,
  })

  if (!visible) return null

  return <Clickable key='save'
    button={props.button}
    label={props.label}
    onClick={ () => {
      if (disabled) return

      setDisabled(true)
      const { mashMedia } = masher
      assertMashMedia(mashMedia)
      
      client.save({ media: mashMedia })
    } }
    className={ className(disabled, props.className) }
  >{props.children}</Clickable>
}
