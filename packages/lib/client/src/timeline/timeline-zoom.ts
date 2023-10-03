import type { NumberEvent } from '@moviemasher/runtime-client'
import type { PropertyDeclarations } from 'lit'

import { EventTypeZoom, MovieMasher } from '@moviemasher/runtime-client'
import { isNumber } from '@moviemasher/runtime-shared'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../Base/Component.js'
import { DisablableMixin, DisablableProperties } from '../Base/DisablableMixin.js'

export const TimelineZoomName = 'movie-masher-timeline-zoom'

const WithDisablable = DisablableMixin(Component)
export class TimelineZoomElement extends WithDisablable {
  private handleInput(event: Event): void {
    const { value } = event.target as HTMLInputElement
    const detail = parseFloat(value)
    if (isNumber(detail)) {
      const event: NumberEvent = new CustomEvent(EventTypeZoom, { detail })
      MovieMasher.eventDispatcher.dispatch(event)
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
    ...DisablableProperties,
    zoom: { type: Number, attribute: false },
   }
}

// register web component as custom element
customElements.define(TimelineZoomName, TimelineZoomElement)

declare global {
  interface HTMLElementTagNameMap {
    [TimelineZoomName]: TimelineZoomElement
  }
}
