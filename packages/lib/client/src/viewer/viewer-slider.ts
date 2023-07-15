import { isNumber, type NumberEvent } from '@moviemasher/runtime-shared'
import type { TimeEvent } from '@moviemasher/runtime-client'
import { Component } from '../Base/Component'

import { html } from 'lit-html/lit-html.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { EventTypeDuration, EventTypeFrame, EventTypeTime, MovieMasher } from '@moviemasher/runtime-client'


export class ViewerSliderElement extends Component {
  constructor() {
    super()
    this.listeners[EventTypeTime] = this.handleTime.bind(this)
    this.listeners[EventTypeDuration] = this.handleDuration.bind(this)
  }

  fps = 0

  frame = 0

  frames = 0

  private handleDuration(event: NumberEvent): void {
    this.frames = event.detail
    // console.log(this.tagName, 'handleDuration', this.frames) 
  }

  private handleInput(event: Event): void {
    const { value } = event.target as HTMLInputElement
    const detail = parseInt(value)
    if (isNumber(detail)) {
      const event: NumberEvent = new CustomEvent(EventTypeFrame, { detail })
      MovieMasher.eventDispatcher.dispatch(event)
    }
  }

  private handleTime(event: TimeEvent): void {
    const { detail: time } = event
    this.frame = time.frame
    this.fps = time.fps
    // console.log(this.tagName, 'handleTime', this.frame, this.fps) 
  }

  protected override render(): unknown {
    const disabled = this.frames ? undefined : true

    return html`<input 
      @input=${this.handleInput}
      type='range'
      disabled='${ifDefined(disabled)}'
      min='0'
      max='${this.frames}'
      step='1'
      value='${this.frame}'
    ></input>`
  }

  static override properties = { 
    ...Component.properties,
    // frame: { type: Number },
    frames: { type: Number },
    fps: { type: Number }
   }
}

// register web component as custom element
customElements.define('movie-masher-viewer-slider', ViewerSliderElement)