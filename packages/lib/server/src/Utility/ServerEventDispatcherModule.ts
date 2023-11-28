
import type { EventDispatcher, EventDispatcherListeners, EventOptions } from '@moviemasher/runtime-shared'

import { EventEmitter }  from 'events'

export class ServerEventDispatcherModule extends EventEmitter implements EventDispatcher {
  addDispatchListener<T>(type: string, listener: (event: CustomEvent<T>, _options?: EventOptions) => void): EventDispatcher {
    this.addListener(type, listener as EventListener)
    return this
  }

  dispatch<T>(typeOrEvent: string | CustomEvent<T> | Event): boolean {
    const isString = typeof typeOrEvent === 'string'
    const name = isString ? typeOrEvent : typeOrEvent.type
    const event = isString ? new CustomEvent<T>(typeOrEvent) : typeOrEvent
    return this.emit(name, event)
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
  
  removeDispatchListener<T>(type: string, listener: (event: CustomEvent<T>) => void, _options?: EventOptions): EventDispatcher {
    this.removeListener(type, listener as EventListener)
    return this
  }
}
