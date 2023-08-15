
import type { EventDispatcher, EventDispatcherListenerRecord } from '@moviemasher/runtime-shared'

import { EventEmitter }  from 'events'


export class ServerEventDispatcher extends EventEmitter implements EventDispatcher {
  addDispatchListener<T>(type: string, listener: (event: CustomEvent<T>) => void): EventDispatcher {
    this.addListener(type, listener as EventListener)
    return this
  }

  dispatch<T>(typeOrEvent: string | CustomEvent<T> | Event): boolean {
    const isString = typeof typeOrEvent === 'string'
    const name = isString ? typeOrEvent : typeOrEvent.type
    const event = isString ? new CustomEvent<T>(typeOrEvent) : typeOrEvent
    return this.emit(name, event)
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
  
  removeDispatchListener<T>(type: string, listener: (event: CustomEvent<T>) => void): EventDispatcher {
    this.removeListener(type, listener as EventListener)
    return this
  }
}