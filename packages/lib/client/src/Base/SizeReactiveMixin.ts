import type { PropertyDeclarations } from 'lit'
import type { Constrained, Size } from '@moviemasher/runtime-shared'
import type { SizeReactive } from '../declarations.js'

import { EventChangedSize, EventSize, MovieMasher } from '@moviemasher/runtime-client'
import { Component } from './Component.js'

export function SizeReactiveMixin
<T extends Constrained<Component>>(Base: T): 
T & Constrained<SizeReactive> {
  return class extends Base implements SizeReactive {
    constructor(...args: any[]) {
      super(...args)
      this.listeners[EventChangedSize.Type] = this.handleChangedSize.bind(this)
    }

    override connectedCallback(): void {
      super.connectedCallback()
      const event = new EventSize()
      MovieMasher.eventDispatcher.dispatch(event)
      const { size } = event.detail
      if (size) this.size = size
      else {
        const max = this.variable('size-preview')
        this.size = size ? size : { width: max, height: max }
      }
    }

    private handleChangedSize(event: EventChangedSize) {
      this.size = event.detail
    }
  
    size?: Size

  }
}

export const SizeReactiveProperties: PropertyDeclarations = {
  size: { type: Object, attribute: false },

}
