import type {MashAsset } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { OptionalContent } from '../client-types.js'

import { SLASH } from '@moviemasher/shared-lib/runtime.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventChangedFrame, EventChangedFrames, EventChangedMashAsset, EventFrames } from '../utility/events.js'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'
import { DISABLABLE_DECLARATIONS, DisablableMixin } from '../mixin/component.js'
import { stringSeconds } from '@moviemasher/shared-lib/utility/time.js'

export const PlayerTimeTag = 'movie-masher-player-time'

const PlayerTimeWithDisablarable = DisablableMixin(Component)

/**
 * @category Elements
 */
export class PlayerTimeElement extends PlayerTimeWithDisablarable {
  constructor() {
    super()
    this.listeners[EventChangedFrame.Type] = this.handleChangedFrame.bind(this)
    this.listeners[EventChangedFrames.Type] = this.handleChangedFrames.bind(this)
  }

  override connectedCallback(): void {
    const event = new EventFrames()
    MOVIEMASHER.dispatch(event)
    const { frames } = event.detail
    this.frames = frames
    super.connectedCallback()
  }

  protected override get defaultContent(): OptionalContent {
    const { frame, frames, mashAsset } = this
    if (!mashAsset) return 

    const { quantize } = mashAsset
    const position = frame / quantize
    const duration = frames / quantize
    const numbers = [position, duration]
    const strings = numbers.map(time => stringSeconds(time, quantize, duration))
    return html`${strings.join(SLASH)}`
  }

  frame = 0

  frames = 0

  private handleChangedFrames(event: EventChangedFrames): void {
    this.frames = event.detail
  }

  private mashAsset: MashAsset | undefined
  
  override handleChangedMashAsset(event: EventChangedMashAsset): void {
    this.mashAsset = event.detail
    super.handleChangedMashAsset(event)
  }

  private handleChangedFrame(event: EventChangedFrame): void {
    this.frame = event.detail
  }

  static override properties: PropertyDeclarations = {
    ...DISABLABLE_DECLARATIONS,
    frame: { type: Number, attribute: false },
    frames: { type: Number, attribute: false },
  }

  static override get styles(): CSSResultGroup[] {
    return [css`
      :host {
        -webkit-user-select: none;
        user-select: none;
        --height: calc(var(--height-label) - (2 * var(--pad-control)));
        text-align: right
        display: inline-block;
        line-height: var(--height);
        font-size: var(--height);
      }
    `]
  }
}

customElements.define(PlayerTimeTag, PlayerTimeElement)

declare global {
  interface HTMLElementTagNameMap {
    [PlayerTimeTag]: PlayerTimeElement
  }
}
