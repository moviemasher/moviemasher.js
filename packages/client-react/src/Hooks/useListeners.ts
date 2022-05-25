import React from "react"
import { Emitter, EventType } from "@moviemasher/moviemasher.js"

import { ListenerCallback } from "../declarations"
import { EditorContext } from "../Contexts/EditorContext"

export interface ListenerEvents extends Partial<Record<EventType, ListenerCallback>> {}


export const useListeners = (events: ListenerEvents, target?: Emitter): void => {
  const editorContext = React.useContext(EditorContext)
  const { editor } = editorContext
  const eventTarget = target || editor!.eventTarget

  const handleEvent = (event : Event) => {
    const { type } = event
    const handler = events[type as EventType]
    if (handler) handler(event)
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
