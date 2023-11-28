import type { NumberEvent } from '@moviemasher/runtime-client'
import type { PropertyDeclarations } from 'lit'

import { css } from '@lit/reactive-element/css-tag.js'
import { EventZoom, MOVIEMASHER } from '@moviemasher/runtime-client'
import { isNumber } from '@moviemasher/runtime-shared'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'
import { DisablableMixin, DISABLABLE_DECLARATIONS } from '../mixins/component.js'

const TimelineRangeTag = 'movie-masher-timeline-range'

const WithDisablable = DisablableMixin(Component)
/**
 * @category Component
 */
export class TimelineRangeElement extends WithDisablable {
  private handleInput(event: Event): void {
    const { value } = event.target as HTMLInputElement
    const detail = parseFloat(value)
    if (isNumber(detail)) {
      const event: NumberEvent = new EventZoom(detail)
      MOVIEMASHER.eventDispatcher.dispatch(event)
    }
  }

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
