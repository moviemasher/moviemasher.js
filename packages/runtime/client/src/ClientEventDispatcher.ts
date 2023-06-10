import type { EventDispatcher } from '@moviemasher/runtime-shared'

export class ClientEventDispatcher extends EventTarget implements EventDispatcher {
  addDispatchListener<T>(type: string, listener: (event: CustomEvent<T>) => void, options?: unknown): EventDispatcher {
    this.addEventListener(type, listener as EventListener, options as AddEventListenerOptions)
    return this
  }

  dispatch<T>(typeOrEvent: string | CustomEvent<T>): boolean {
    const event = typeof typeOrEvent === 'string' ? new CustomEvent<T>(typeOrEvent) : typeOrEvent
    return this.dispatchEvent(event)
  }

  removeDispatchListener<T>(type: string, listener: (event: CustomEvent<T>) => void, options?: unknown): EventDispatcher {
    this.removeEventListener(type, listener as EventListener, options as AddEventListenerOptions)
    return this
  }
}
