import React from "react"
import { Emitter, EventType } from "@moviemasher/moviemasher.js"

import { ListenerCallback } from "../declarations"
import { MasherContext } from "../Components/Masher/MasherContext"

export interface ListenerEvents extends Partial<Record<EventType, ListenerCallback>> {}


export const useListeners = (events: ListenerEvents, target?: Emitter): void => {
  const masherContext = React.useContext(MasherContext)
  const { editor } = masherContext
  const eventTarget = target || editor!.eventTarget

  const handleEvent = (event : Event) => {
    const { type } = event
    const handler = events[type as EventType]
    if (handler) handler(event)
  }

  const removeListeners = () => {
    const keys = Object.keys(events)
    // console.log("useListeners.removeListeners", keys)
    keys.forEach(eventType => {
      eventTarget.removeEventListener(eventType, handleEvent)
    })
  }

  const addListeners = () => {
    Object.keys(events).forEach(eventType => {
      eventTarget.addEventListener(eventType, handleEvent)
    })
    return () => { removeListeners() }
  }

  React.useEffect(() => addListeners(), [])
}
