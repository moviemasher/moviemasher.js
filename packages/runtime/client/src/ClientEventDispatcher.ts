import type { EventDispatcher, EventDispatcherListener, EventDispatcherListenerRecord, EventDispatcherOptionsOrBoolean } from '@moviemasher/runtime-shared'

export class ClientEventDispatcher extends EventTarget implements EventDispatcher {
  addDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventDispatcherOptionsOrBoolean): EventDispatcher {
    this.addEventListener(type, listener as EventListener, options)
    return this
  }

  dispatch<T>(typeOrEvent: string | CustomEvent<T> | Event): boolean {
    const event = typeof typeOrEvent === 'string' ? new CustomEvent<T>(typeOrEvent) : typeOrEvent
    return this.dispatchEvent(event)
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
  
  removeDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventDispatcherOptionsOrBoolean): EventDispatcher {
    this.removeEventListener(type, listener as EventListener, options)
    return this
  }
}
