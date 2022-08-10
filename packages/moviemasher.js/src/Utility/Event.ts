export const eventStop = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
}