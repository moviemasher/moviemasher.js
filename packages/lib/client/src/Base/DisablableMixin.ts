import type { PropertyDeclarations } from 'lit'
import type { Constrained } from '@moviemasher/runtime-shared'
import type { Disablable } from '../declarations.js'

import { EventChangedMashAsset, EventMashAsset, MovieMasher } from '@moviemasher/runtime-client'
import { Component } from './Component.js'

export function DisablableMixin
<T extends Constrained<Component>>(Base: T): 
T & Constrained<Disablable> {
  return class extends Base implements Disablable {
    constructor(...args: any[]) {
      super(...args)
      // console.log(this.tagName, 'DisablableMixin')
      this.listeners[EventChangedMashAsset.Type] = this.handleChangedMashAsset.bind(this)  
    }

    override connectedCallback(): void {
      super.connectedCallback()
      const event = new EventMashAsset()
      MovieMasher.eventDispatcher.dispatch(event)
      this.disabled = !event.detail.mashAsset
    }
    
    disabled = true

    handleChangedMashAsset(event: EventChangedMashAsset): void { 
      this.disabled = !event.detail
      // console.log(this.tagName, 'handleChangedMashAsset', !event.detail, this.disabled)
    }
  }
}

export const DisablableProperties: PropertyDeclarations = {
  disabled: { type: Boolean, attribute: false },
}
