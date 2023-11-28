import { isFunction, isObject } from "./TypeofGuards.js"

export interface EventDispatcherListener<T=any> {
  (event: CustomEvent<T>): void
}

export interface EventDispatcherListeners extends Record<string, EventDispatcherListener> {}

export interface ListenersFunction {
  (): EventDispatcherListeners
}

export interface EventDispatcherOptions {
  once?: boolean
  capture?: boolean
}

export type EventOptions = EventDispatcherOptions | boolean

export interface EventDispatcher {
  addDispatchListener: <T=any>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions) => void
  dispatch: <T>(typeOrEvent: string | CustomEvent<T> | Event) => boolean
  listenersAdd(record: EventDispatcherListeners): void
  listenersRemove(record: EventDispatcherListeners): void
  removeDispatchListener: <T=any>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions) => void
}

export const isListenerRecord = (value: any): value is EventDispatcherListeners => (
  isObject(value) && Object.values(value).every(isFunction)
)