import React from "react"
import { EventType } from "@moviemasher/moviemasher.js"

import { ListenerCallback } from "../declarations"
import { useEditor } from "./useEditor"

export interface ListenerEvents extends Partial<Record<EventType, ListenerCallback>> {}

export const useListeners = (events: ListenerEvents): void => {
  const editor = useEditor()
  const { eventTarget } = editor

  const handleEvent = (event : Event) => {
    const { type } = event
    const handler = events[type as EventType]
    if (handler) handler(event)
  }

  const removeListeners = () => {
    const keys = Object.keys(events)
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
