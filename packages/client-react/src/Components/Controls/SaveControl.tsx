import React from "react"
import /* type */ { PropsClickable } from "../../Types/Props"

import { 
  assertMashMedia, EventType, isMashMedia, MasherAction 
} from "@moviemasher/moviemasher.js"

import { className, WriteOperation } from "@moviemasher/client-core"
import { useClient } from "../../Hooks/useClient"
import { useListeners } from "../../Hooks/useListeners"
import { useMasher } from "../../Hooks/useMasher"
import Clickable from "../Clickable/Clickable.lite"

export function SaveControl(props: PropsClickable) {
  const masher = useMasher()
  const client = useClient()
  
  const getVisible = () => {
    if (!client.enabled(WriteOperation)) return false

    return isMashMedia(masher.mashMedia)
  }
  const [visible, setVisible] = React.useState(getVisible)
  const getDisabled = () => !masher.can(MasherAction.Save)
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => setDisabled(getDisabled())
  const updateVisible = () => setVisible(getVisible())
  const updateBoth = () => { 
    updateVisible() 
    updateDisabled()
  }

  useListeners({
    [EventType.Action]: updateDisabled, 
    [EventType.Loaded]: updateBoth,
    [EventType.Save]: updateDisabled,
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
