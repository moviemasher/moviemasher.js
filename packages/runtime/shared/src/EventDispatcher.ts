import { isFunction, isObject } from "./TypeofGuards.js"

export type EventDispatcherListener<T=any> = (event: CustomEvent<T>) => void
export type EventDispatcherListenerRecord = Record<string, EventDispatcherListener>

export interface EventDispatcherOptions {
  once?: boolean
  capture?: boolean
}

export type EventDispatcherOptionsOrBoolean = EventDispatcherOptions | boolean

export interface EventDispatcher {
  addDispatchListener: <T=any>(type: string, listener: EventDispatcherListener<T>, options?: EventDispatcherOptionsOrBoolean) => void
  dispatch: <T>(typeOrEvent: string | CustomEvent<T> | Event) => boolean
  listenersAdd(record: EventDispatcherListenerRecord): void
  listenersRemove(record: EventDispatcherListenerRecord): void
  removeDispatchListener: <T=any>(type: string, listener: EventDispatcherListener<T>, options?: EventDispatcherOptionsOrBoolean) => void
}

export const isListenerRecord = (value: any): value is EventDispatcherListenerRecord => (
  isObject(value) && Object.values(value).every(isFunction)
)