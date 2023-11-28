import { EventChangedClientAction, EventDoClientAction, EventEnabledClientAction, MOVIEMASHER, PLAY } from '@moviemasher/runtime-client'
import { IconString } from '../base/Component.js'

const PlayerButtonTag = 'movie-masher-player-button'

/**
 * @category Component
 */
export class PlayerButtonElement extends IconString {
  override connectedCallback(): void {
    this.emit = EventDoClientAction.Type 
    this.detail = PLAY
    this.icon = PLAY
    this.listeners[EventChangedClientAction.Type] = this.handleChangedAction.bind(this)
    super.connectedCallback() 
  }


  private handleChangedAction(event: EventChangedClientAction): void {
    const { detail } = this

    if (detail === event.detail) {
      const enabledEvent = new EventEnabledClientAction(detail)
      MOVIEMASHER.eventDispatcher.dispatch(enabledEvent)

      this.icon = enabledEvent.detail.enabled ? PLAY : 'pause'
    }
  }
}

customElements.define(PlayerButtonTag, PlayerButtonElement)

declare global {
  interface HTMLElementTagNameMap {
    [PlayerButtonTag]: PlayerButtonElement
  }
}
