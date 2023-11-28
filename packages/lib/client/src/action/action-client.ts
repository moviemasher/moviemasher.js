import type { PropertyValues } from 'lit'

import { EventDoClientAction, EventEnabledClientAction, EventChangedClientAction, MOVIEMASHER } from '@moviemasher/runtime-client'
import { ButtonElement } from '../component/component-button.js'

const ClientActionTag = 'movie-masher-action-client'

/**
 * @category Component
 */
export class ClientActionElement extends ButtonElement {
  override connectedCallback(): void {
    this.emit = EventDoClientAction.Type 
    this.listeners[EventChangedClientAction.Type] = this.handleChangedAction.bind(this)
    super.connectedCallback() 
  }

  private get enabledEvent() {
    const { detail } = this
    return detail ? new EventEnabledClientAction(detail) : undefined
  }
  
  private handleChangedAction(event: EventChangedClientAction): void {
    if (this.detail === event.detail) this.handleChanged()
  }

  private handleChanged() {
    const { enabledEvent } = this
    if (!enabledEvent) return
    
    MOVIEMASHER.eventDispatcher.dispatch(enabledEvent)
    this.disabled = !enabledEvent.detail.enabled
  } 

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has('detail')) { this.handleChanged() }
  }
}

customElements.define(ClientActionTag, ClientActionElement)

declare global {
  interface HTMLElementTagNameMap {
    [ClientActionTag]: ClientActionElement
  }
}
