import type { PropertyDeclarations } from 'lit'
import type { NumberEvent } from '@moviemasher/runtime-client'

import { isNumber } from '@moviemasher/runtime-shared'
import { Component } from '../Base/Component.js'

import { html } from 'lit-html/lit-html.js'

import { EventTypeZoom, MovieMasher } from '@moviemasher/runtime-client'
import { DisablableMixin, DisablableProperties } from '../Base/DisablableMixin.js'

const WithDisablable = DisablableMixin(Component)
export class ComposerZoomElement extends WithDisablable {

  protected zoom = 1.0

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
      @input=${this.handleInput}
      type='range'
      ?disabled='${this.disabled}'
      min='0'
      max='1'
      step='0.001'
      value='${this.zoom}'
    ></input>
    `
  }

  static override properties: PropertyDeclarations = { 
    ...DisablableProperties,
    zoom: { type: Number, attribute: false },
   }
}

// register web component as custom element
customElements.define('movie-masher-composer-zoom', ComposerZoomElement)