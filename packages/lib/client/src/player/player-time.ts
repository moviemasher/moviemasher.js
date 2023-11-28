import { SLASH, type MashAsset } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { OptionalContent } from '../Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { EventChangedFrame, EventChangedFrames, EventChangedMashAsset, EventFrames, MOVIEMASHER } from '@moviemasher/runtime-client'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'
import { DISABLABLE_DECLARATIONS, DisablableMixin } from '../mixins/component.js'
import { stringSeconds } from '@moviemasher/lib-shared/utility/time.js'

const PlayerTimeTag = 'movie-masher-player-time'

const PlayerTimeWithDisablarable = DisablableMixin(Component)

/**
 * @category Component
 */
export class PlayerTimeElement extends PlayerTimeWithDisablarable {
  constructor() {
    super()
    this.listeners[EventChangedFrame.Type] = this.handleChangedFrame.bind(this)
    this.listeners[EventChangedFrames.Type] = this.handleChangedFrames.bind(this)
  }

  override connectedCallback(): void {
    const event = new EventFrames()
    MOVIEMASHER.eventDispatcher.dispatch(event)
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
    const times = [position, duration]
    const strings = times.map(time => stringSeconds(time, quantize, duration))
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
