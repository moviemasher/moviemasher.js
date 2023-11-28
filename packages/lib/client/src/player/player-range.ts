import type { PropertyDeclarations } from 'lit'

import { css } from '@lit/reactive-element/css-tag.js'
import { EventChangeFrame, EventChangedFrame, EventChangedFrames, EventFrames, MOVIEMASHER } from '@moviemasher/runtime-client'
import { isNumber } from '@moviemasher/runtime-shared'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'

const PlayerRangeTag = 'movie-masher-player-range'

/**
 * @category Component
 */
export class PlayerRangeElement extends Component {
  constructor() {
    super()
    this.listeners[EventChangedFrame.Type] = this.handleFrame.bind(this)
    this.listeners[EventChangedFrames.Type] = this.handleChangedFrames.bind(this)
  }

  override connectedCallback(): void {
    const event = new EventFrames()
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { frames } = event.detail
    this.frames = frames
    super.connectedCallback()
  }
  
  frame = 0

  frames = 0

  private handleChangedFrames(event: EventChangedFrames): void {
    const { detail: frames } = event
    this.frames = frames
  }

  private handleInput(event: Event): void {
    const { value } = event.target as HTMLInputElement
    const detail = parseInt(value)
    if (isNumber(detail)) {
      MOVIEMASHER.eventDispatcher.dispatch(new EventChangeFrame(detail))
    }
  }

  private handleFrame(event: EventChangedFrame): void {
    const { detail: frame } = event
    this.frame = frame
  }

  protected override render(): unknown {
    const input = this.shadowRoot?.querySelector('input')
    if (input) input.value = String(this.frame)

    return html`<input 
      aria-label='frame'
      @input=${this.handleInput}
      type='range'
      ?disabled='${!this.frames}'
      min='0'
      max='${this.frames}'
      step='1'
      value='${this.frame}'
    ></input>`
  }
  
  static override properties: PropertyDeclarations = { 
    // ...Component.properties,
    frame: { type: Number },
    frames: { type: Number },
  }


  static override styles = [
    css`
      input {
        flex-grow: 1;
        width: 100%;
        min-width: 50px;
        height: var(--height-control);
        accent-color: var(--fore);
      }
      input:hover {
        accent-color: var(--over);
      }
    `
  ]
}

customElements.define(PlayerRangeTag, PlayerRangeElement)

declare global {
  interface HTMLElementTagNameMap {
    [PlayerRangeTag]: PlayerRangeElement
  }
}
