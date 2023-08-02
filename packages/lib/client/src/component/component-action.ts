import type { PropertyDeclarations } from 'lit'
import type { PropertyValues } from 'lit'

import { EventAction, EventActionEnabled, EventChanged, EventChangedMashAsset, MovieMasher } from '@moviemasher/runtime-client'
import { ButtonElement } from './component-button.js'
import { DisablableMixin, DisablableProperties } from '../Base/DisablableMixin.js'

const WithDisablable = DisablableMixin(ButtonElement)
export class ActionElement extends WithDisablable {
  constructor() {
    super()
    this.emit = EventAction.Type
    this.listeners[EventChanged.Type] = this.handleChanged.bind(this)
  }

  private handleChanged() {
    const { detail } = this
    if (!detail) return

    const event = new EventActionEnabled(detail)
    MovieMasher.eventDispatcher.dispatch(event)
    this.disabled = !event.detail.enabled
  } 

  override handleChangedMashAsset(event: EventChangedMashAsset): void {
    super.handleChangedMashAsset(event)
    if (event.detail) this.handleChanged()
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has('detail')) {
      this.handleChanged()
    }
  }
  static override properties: PropertyDeclarations = {
    
    DisablableProperties,
  }
}

// register web component as custom element
customElements.define('movie-masher-component-action', ActionElement)
