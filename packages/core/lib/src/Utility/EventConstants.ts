import type { EventFunction } from "./EventFunction.js"

export const eventStop: EventFunction = event => {
  event.preventDefault()
  event.stopPropagation()
}