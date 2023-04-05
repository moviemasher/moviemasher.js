import type { ConnectionEventDetail } from '../declarations'

import { property } from '@lit/reactive-element/decorators/property.js'

import { LitElement } from 'lit-element'

export class Base extends LitElement {
  @property()
  slotted = ''

  protected slots: string[] = []

  protected connectionDetail(connected: boolean): ConnectionEventDetail {
    const { slots, slotted } = this
    const detail: ConnectionEventDetail = { slots, slotted, connected }
    return detail
  }

  protected dispatchConnection(connected: boolean) {

    const detail = this.connectionDetail(connected)
    const { slots, slotted } = detail
    if (!(slotted && slots.length)) {
      // console.debug(this.constructor.name, 'dispatchConnection without slotted or slots', slotted, slots)
      return
    }

    const init: CustomEventInit<ConnectionEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    const event = new CustomEvent<ConnectionEventDetail>('connection', init)
    // console.debug(this.constructor.name, 'dispatchConnection dispatching', detail)
    this.dispatchEvent(event)
  }
  override connectedCallback() {
    this.dispatchConnection(true)
    super.connectedCallback()
  }  
  
  override disconnectedCallback() {
    this.dispatchConnection(false)
    super.disconnectedCallback()
  }
}
