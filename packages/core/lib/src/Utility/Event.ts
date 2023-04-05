import type { EventFunction } from '../Types/Function.js'

export const eventStop: EventFunction = event => {
  event.preventDefault()
  event.stopPropagation()
}