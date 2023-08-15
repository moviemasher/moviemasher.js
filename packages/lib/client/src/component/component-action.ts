import type { PropertyDeclarations, PropertyValues } from 'lit'

import { EventAction, EventActionEnabled, EventChangedActionEnabled, MovieMasher } from '@moviemasher/runtime-client'
import { ButtonElement } from './component-button.js'

// const WithDisablable = DisablableMixin(ButtonElement)
export class ActionElement extends ButtonElement {
  constructor() {
    super()
    this.emit = EventAction.Type
    this.listeners[EventChangedActionEnabled.Type] = this.handleChangedActionEnabled.bind(this)
  }

  private handleChangedActionEnabled(event: EventChangedActionEnabled): void {
    const { detail: actionType } = event
    const { detail } = this
    if (detail === actionType) this.handleChanged()
  }

  private handleChanged() {
    const { detail } = this
    if (!detail) return

    const event = new EventActionEnabled(detail)
    MovieMasher.eventDispatcher.dispatch(event)
    console.log(this.tagName, 'handleChanged', event.detail)
    this.disabled = !event.detail.enabled
  } 

  // override handleChangedMashAsset(event: EventChangedMashAsset): void {
  //   super.handleChangedMashAsset(event)
  //   if (event.detail) this.handleChanged()
  // }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has('detail')) { this.handleChanged() }
  }
  static override properties: PropertyDeclarations = {
    disabled: { type: Boolean, attribute: false },
  }
}

// register web component as custom element
customElements.define('movie-masher-component-action', ActionElement)
