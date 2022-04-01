import React from "react"
import { EventType } from "@moviemasher/moviemasher.js"

import { useEditor } from "./useEditor"
import { ListenerCallback } from "../declarations"

export interface ListenerEvents extends Partial<Record<EventType, ListenerCallback>> {}


const useListeners = (events: ListenerEvents): void => {
  const editor = useEditor()
  const { eventTarget } = editor

  const handleEvent = (event : Event) => {
    const { type } = event
    const handler = events[type as EventType]
    if (handler) handler()
  }
  const removeListeners = () => {
    Object.keys(events).forEach(eventType => {
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

export { useListeners }
