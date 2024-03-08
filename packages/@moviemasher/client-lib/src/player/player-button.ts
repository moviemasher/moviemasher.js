import { $PLAY, MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { ComponentClicker } from '../base/component.js'
import { EventChangedClientAction, EventDoClientAction, EventEnabledClientAction } from '../module/event.js'

export const PlayerButtonTag = 'movie-masher-player-button'

/**
 * @category Elements
 */
export class PlayerButtonElement extends ComponentClicker {
  override connectedCallback(): void {
    this.emit = EventDoClientAction.Type 
    this.detail = $PLAY
    this.icon = $PLAY
    this.listeners[EventChangedClientAction.Type] = this.handleChangedAction.bind(this)
    super.connectedCallback() 
  }


  private handleChangedAction(event: EventChangedClientAction): void {
    const { detail } = this

    if (detail === event.detail) {
      const enabledEvent = new EventEnabledClientAction(detail)
      MOVIE_MASHER.dispatchCustom(enabledEvent)

      this.icon = enabledEvent.detail.enabled ? $PLAY : 'pause'
    }
  }
}

customElements.define(PlayerButtonTag, PlayerButtonElement)

declare global {
  interface HTMLElementTagNameMap {
    [PlayerButtonTag]: PlayerButtonElement
  }
}
