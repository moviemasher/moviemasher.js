import React from "react"

import type { PropsClickable } from "../../Types/Props"

import { assertEndpoint, assertMashMedia, endpointUrl, EventType, isMashMedia } from "@moviemasher/lib-core"

import { useMasher } from "../../Hooks/useMasher"
import { useListeners } from "../../Hooks/useListeners"
import { className } from "@moviemasher/client-core"
import Clickable from "../Clickable/Clickable.lite"

export function ViewControl(props: PropsClickable) {
  const masher = useMasher()

  const getDisabled = () => {
    const { mashMedia } = masher
    if (!isMashMedia(mashMedia)) return true

    const { encodings } = mashMedia
    return !encodings.length
  }

  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => setDisabled(getDisabled())

  useListeners({
    [EventType.Render]: updateDisabled,
    [EventType.Loaded]: updateDisabled
  })

  return <Clickable key='encode'
    button={props.button}
    label={props.label}
    onClick={
      () => {
        if (disabled) return
    
        const { mashMedia } = masher
        assertMashMedia(mashMedia)
        
        const { encodings } = mashMedia
        const [encoding] = encodings
        const {endpoint} = encoding.request
        assertEndpoint(endpoint)
        
        const url = endpointUrl(endpoint)
        window.open(url)
      }
    }
    className={ className(disabled, props.className) }
  >{props.children}</Clickable> 
}
