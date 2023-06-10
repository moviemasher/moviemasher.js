export interface EventDispatcher {
  addDispatchListener: <T>(type: string, listener: (event: CustomEvent<T>) => void, options?: unknown) => EventDispatcher
  dispatch: <T>(typeOrEvent: string | CustomEvent<T>) => boolean
  removeDispatchListener: <T>(type: string, listener: (event: CustomEvent<T>) => void, options?: unknown) => EventDispatcher
}
