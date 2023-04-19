import type { ConnectionEventDetail } from '../declarations'

import { LitElement } from 'lit'
import { property } from 'lit/decorators/property.js'

export class Base extends LitElement {
  @property()
  slotted = ''

  protected slots: string[] = []

  override connectedCallback() {
    const { parentElement } = this
    if (parentElement && parentElement.isConnected) {
      
      //instanceof Base
      this.dispatchConnection(true)
    }
    // console.debug(this.tagName, 'connectedCallback', this.parentElement?.tagName)
    super.connectedCallback()
  }  
  
  protected connectionDetail(connected: boolean): ConnectionEventDetail {
    const { slots, slotted } = this
    const detail: ConnectionEventDetail = { slots, slotted, connected }
    return detail
  }
  
  override disconnectedCallback() {

    const { parentElement } = this
    if (parentElement && parentElement.isConnected) {
      this.dispatchConnection(false)
    }
    super.disconnectedCallback()
  }

  protected dispatchConnection(connected: boolean): boolean {
    const detail = this.connectionDetail(connected)
    const { slots, slotted } = detail
    if (!(slotted || slots.length)) {
      // console.debug(this.constructor.name, 'dispatchConnection without slotted or slots', slotted, slots)
      return false
    }

    const init: CustomEventInit<ConnectionEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    const event = new CustomEvent<ConnectionEventDetail>('connection', init)
    // console.debug(this.constructor.name, 'dispatchConnection dispatching', detail)
    this.dispatchEvent(event)
    return true
  }


  // override async getUpdateComplete(): Promise<boolean> {
  //   return super.getUpdateComplete()
  // }
}
