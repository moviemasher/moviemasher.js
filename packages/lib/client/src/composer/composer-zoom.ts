import { isNumber, type NumberEvent } from '@moviemasher/runtime-shared'
import type { MashAssetEvent } from '@moviemasher/runtime-client'
import { Component } from '../Base/Component'

import { html } from 'lit-html/lit-html.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { EventTypeZoom, MovieMasher, EventTypeMashAsset } from '@moviemasher/runtime-client'


export class ComposerZoomElement extends Component {
  constructor() {
    super()
    this.listeners[EventTypeMashAsset] = this.handleMashAsset.bind(this)
  }

  protected zoom = 0.0

  protected disabled?: true | undefined

  private handleInput(event: Event): void {
    const { value } = event.target as HTMLInputElement
    const detail = parseFloat(value)
    if (isNumber(detail)) {
      const event: NumberEvent = new CustomEvent(EventTypeZoom, { detail })
      MovieMasher.eventDispatcher.dispatch(event)
    }
  }

  private handleMashAsset(event: MashAssetEvent): void {
    const { detail } = event
    this.disabled = detail ? undefined : true
  }

  protected override render(): unknown {
    return html`<input 
      @input=${this.handleInput}
      type='range'
      disabled='${ifDefined(this.disabled)}'
      min='0'
      max='1'
      step='0.001'
      value='${this.zoom}'
    ></input>`
  }

  static override properties = { 
    ...Component.properties,
    zoom: { type: Number, attribute: false },
    disabled: { type: Boolean, attribute: false },
   }
}

// register web component as custom element
customElements.define('movie-masher-composer-zoom', ComposerZoomElement)