import type { PropertyDeclarations } from 'lit'

import { css } from '@lit/reactive-element/css-tag.js'
import { MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { isNumber } from '@moviemasher/shared-lib/utility/guard.js'
import { html } from 'lit-html'
import { Component } from '../base/component.js'
import { EventChangeFrame, EventTimeUpdate, EventChangedFrames, EventFrames } from '../module/event.js'

export const PlayerRangeTag = 'movie-masher-player-range'

/**
 * @category Elements
 */
export class PlayerRangeElement extends Component {
  constructor() {
    super()
    this.listeners[EventTimeUpdate.Type] = this.handleChangedFrame.bind(this)
    this.listeners[EventChangedFrames.Type] = this.handleChangedFrames.bind(this)
  }

  override connectedCallback(): void {
    const event = new EventFrames()
    MOVIE_MASHER.dispatchCustom(event)
    const { frames } = event.detail
    this.frames = frames
    super.connectedCallback()
  }
  
  frame = 0

  frames = 0

  private handleChangedFrames(event: EventChangedFrames): void {
    const { detail: frames } = event
    // console.log('PlayerRangeElement.handleChangedFrames', frames)
    this.frames = frames
  }

  private handleInput(event: Event): void {
    const { value } = event.target as HTMLInputElement
    const detail = parseInt(value)
    if (isNumber(detail)) {
      // console.log('PlayerRangeElement.handleInput', detail)
      MOVIE_MASHER.dispatchCustom(new EventChangeFrame(detail))
    }
  }

  private handleChangedFrame(event: EventTimeUpdate): void {
    const { detail: frame } = event
    // console.log('PlayerRangeElement.handleChangedFrame', frame)
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
