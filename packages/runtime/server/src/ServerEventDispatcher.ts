
import type { EventDispatcher, EventDispatcherListener, EventDispatcherListenerRecord, EventDispatcherOptionsOrBoolean } from '@moviemasher/runtime-shared'

/**
 * Uses the global object as the event dispatcher.
 */
export class ServerEventDispatcher implements EventDispatcher {
  addDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventDispatcherOptionsOrBoolean): void {
    addEventListener(type, listener as EventListener, options)
  }

  dispatch<T>(typeOrEvent: string | CustomEvent<T> | Event): boolean {
    const isString = typeof typeOrEvent === 'string'
    const name = isString ? typeOrEvent : typeOrEvent.type
    const event = isString ? new CustomEvent<T>(typeOrEvent) : typeOrEvent
    return dispatchEvent(event)
  }

  listenersAdd(record: EventDispatcherListenerRecord) {
    Object.entries(record).forEach(([type, listener]) => {
      this.addDispatchListener(type, listener)
    })
  }

  listenersRemove(record: EventDispatcherListenerRecord) {
    Object.entries(record).forEach(([type, listener]) => {
      this.removeDispatchListener(type, listener)
    })
  }
  
  removeDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventDispatcherOptionsOrBoolean): void {
    removeEventListener(type, listener as EventListener, options)
  }
}
