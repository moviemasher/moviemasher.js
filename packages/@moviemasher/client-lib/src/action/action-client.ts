import type { PropertyValues } from 'lit'

import { MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventDoClientAction, EventEnabledClientAction, EventChangedClientAction } from '../utility/events.js'
import { ButtonElement } from '../component/button.js'

export const ClientActionTag = 'movie-masher-action-client'

/**
 * @category Elements
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
    
    MOVIE_MASHER.dispatch(enabledEvent)
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
