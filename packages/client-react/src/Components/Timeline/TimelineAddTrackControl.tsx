import React from "react"
import { EventType } from "@moviemasher/moviemasher.js"

import /* type */ { PropsClickable } from "../../Types/Props"
import { useMasher } from "../../Hooks/useMasher"
import { useListeners } from "../../Hooks/useListeners"
import { className } from "@moviemasher/client-core"
import Clickable from "../Clickable/Clickable.lite"


export function TimelineAddTrackControl(props:PropsClickable) {
  const masher = useMasher()
  const getDisabled = () => !masher.mashMedia
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled())}
  useListeners({ [EventType.Selection]: updateDisabled })
  
  return <Clickable key='encode'
    button={props.button}
    label={props.label}
    onClick={ () => masher.addTrack() }
    className={ className(disabled, props.className) }
  >{props.children}</Clickable>
}
