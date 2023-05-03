import React from "react"
import { EventTypeSelection } from "@moviemasher/lib-core"

import type { PropsClickable } from "../../Types/Props"
import { useMasher } from "../../Hooks/useMasher"
import { useListeners } from "../../Hooks/useListeners"
import { className } from "@moviemasher/client-core"
import Clickable from "../Clickable/Clickable.lite"


export function TimelineAddTrackControl(props:PropsClickable) {
  const masher = useMasher()
  const getDisabled = () => !masher.mashMedia
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled())}
  useListeners({ [EventTypeSelection]: updateDisabled })
  
  return <Clickable key='encode'
    button={props.button}
    label={props.label}
    onClick={ () => masher.addTrack() }
    className={ className(disabled, props.className) }
  >{props.children}</Clickable>
}
