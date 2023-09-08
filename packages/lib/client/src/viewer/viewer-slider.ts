import type { PropertyDeclarations } from 'lit'

import { html } from 'lit-html/lit-html.js'

import { isNumber } from '@moviemasher/runtime-shared'
import { EventChangeFrame, EventChangedFrame, EventChangedFrames, EventFrames, MovieMasher } from '@moviemasher/runtime-client'
import { Component } from '../Base/Component'


export class ViewerSliderElement extends Component {
  constructor() {
    super()
    this.listeners[EventChangedFrame.Type] = this.handleFrame.bind(this)
    this.listeners[EventChangedFrames.Type] = this.handleChangedFrames.bind(this)
  }


  override connectedCallback(): void {
    const event = new EventFrames()
    MovieMasher.eventDispatcher.dispatch(event)
    const { frames } = event.detail
    console.log(this.tagName, 'connectedCallback', { frames })
    this.frames = frames
    super.connectedCallback()
  }
  
  frame = 0

  frames = 0

  private handleChangedFrames(event: EventChangedFrames): void {
    const { detail: frames } = event
    this.frames = frames
    console.log(this.tagName, 'handleChangedFrames', frames) 
  }

  private handleInput(event: Event): void {
    const { value } = event.target as HTMLInputElement
    const detail = parseInt(value)
    if (isNumber(detail)) {
      MovieMasher.eventDispatcher.dispatch(new EventChangeFrame(detail))
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
}

// register web component as custom element
customElements.define('movie-masher-viewer-slider', ViewerSliderElement)