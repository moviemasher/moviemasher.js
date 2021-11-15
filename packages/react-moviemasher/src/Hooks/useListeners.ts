import React from "react"
import { EventType, Masher } from "@moviemasher/moviemasher.js"

import { EditorContext, EditorContextInterface } from "../Components/Editor/EditorContext"
import { ListenerEvents } from "../declarations"

const useListeners = (events: ListenerEvents) : EditorContextInterface => {
  const editorContext = React.useContext(EditorContext)
  const { masher } = editorContext
  const { eventTarget } = masher

  const handleEvent = (event : Event) => {
    const { type } = event
    const handler = events[type as EventType]
    if (handler) handler(masher)
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

  return editorContext
}

export { useListeners }
