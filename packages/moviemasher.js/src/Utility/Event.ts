import { EventFunction } from "../Types/Function"

export const eventStop: EventFunction = event => {
  event.preventDefault()
  event.stopPropagation()
}