export type EventDispatcherListener<T=any> = (event: CustomEvent<T>) => void
export type EventDispatcherListenerRecord = Record<string, EventDispatcherListener>

export interface EventDispatcher {
  addDispatchListener: <T=any>(type: string, listener: EventDispatcherListener<T>, options?: unknown) => EventDispatcher
  dispatch: <T>(typeOrEvent: string | CustomEvent<T>) => boolean
  listenersAdd(record: EventDispatcherListenerRecord): void
  listenersRemove(record: EventDispatcherListenerRecord): void
  removeDispatchListener: <T=any>(type: string, listener: EventDispatcherListener<T>, options?: unknown) => EventDispatcher
}
