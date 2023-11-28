
import type { EventDispatcher, EventDispatcherListener, EventDispatcherListeners, EventOptions } from '@moviemasher/runtime-shared'

/**
 * Uses the global object as the event dispatcher.
 */
export class ServerEventDispatcher implements EventDispatcher {
  addDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions): void {
    addEventListener(type, listener as EventListener, options)
  }

  dispatch<T>(typeOrEvent: string | CustomEvent<T> | Event): boolean {
    const string = typeof (typeOrEvent) === 'string'
    const event = string ? new CustomEvent<T>(typeOrEvent) : typeOrEvent
    return dispatchEvent(event)
  }

  listenersAdd(record: EventDispatcherListeners) {
    Object.entries(record).forEach(([type, listener]) => {
      this.addDispatchListener(type, listener)
    })
  }

  listenersRemove(record: EventDispatcherListeners) {
    Object.entries(record).forEach(([type, listener]) => {
      this.removeDispatchListener(type, listener)
    })
  }
  
  removeDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions): void {
    removeEventListener(type, listener as EventListener, options)
  }
}
