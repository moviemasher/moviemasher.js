import type { PropertyDeclarations } from 'lit'

import { css } from '@lit/reactive-element/css-tag.js'
import { MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventZoom, NumberEvent } from '../utility/events.js'
import { isNumber } from '@moviemasher/shared-lib/utility/guard.js'
import { html } from 'lit-html'
import { Component } from '../base/component.js'
import { DisablableMixin, DISABLABLE_DECLARATIONS } from '../mixin/component.js'

export const TimelineRangeTag = 'movie-masher-timeline-range'

const WithDisablable = DisablableMixin(Component)

/**
 * @category Elements
 */
export class TimelineRangeElement extends WithDisablable {

  override connectedCallback(): void {
    this.listeners[EventZoom.Type] = this.handleZoom.bind(this)
    super.connectedCallback()
  }

  private handleInput(event: Event): void {
    const { value } = event.target as HTMLInputElement
    const detail = parseFloat(value)
    if (isNumber(detail)) {
      const event: NumberEvent = new EventZoom(detail)
      MOVIE_MASHER.dispatch(event)
    }
  }

  private handleZoom(event: NumberEvent): void { this.zoom = event.detail }

  protected override render(): unknown {
    return html`<input 
      aria-label='zoom'
      @input=${this.handleInput}
      type='range'
      ?disabled='${this.disabled}'
      min='0.001'
      max='1'
      step='0.001'
      value='${this.zoom}'
    ></input>
    `
  }

  protected zoom = 1.0

  static override properties: PropertyDeclarations = { 
    ...DISABLABLE_DECLARATIONS,
    zoom: { type: Number, attribute: false },
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

customElements.define(TimelineRangeTag, TimelineRangeElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineRangeTag]: TimelineRangeElement
  }
}
