import type { DataType, PropertyId } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit-element/lit-element.js'
import type { OptionalContent } from '../client-types.js'

import { isPopulatedString } from '@moviemasher/shared-lib/runtime.js'
import { Component } from '../base/Component.js'
import { CONTROL_PROPERTY_DECLARATIONS, ControlPropertyMixin } from '../handler/controls.js'
import { MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventControl, EventDataType } from '../utility/events.js'

export const ControlInputTag = 'movie-masher-control-input'
const WithControlProperty = ControlPropertyMixin(Component)
/**
 * @category Elements
 */
export class ControlInputElement extends WithControlProperty {
  private _control?: Node
  private get control(): Node | undefined {
    return this._control ||= this.controlInitialize
  }

  private get controlInitialize(): Node | undefined {
    const { dataType, propertyId } = this
    if (!propertyId) return

    const type = dataType || this.propertyDataType(propertyId)
    if (!type) {
      console.warn(this.tagName, 'controlInitialize', propertyId, 'no data type')
      return
    }
    // console.log(this.tagName, 'controlInitialize', type, propertyId)

    const event = new EventControl(type, propertyId)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    return event.detail.control
  }

  dataType?: DataType

  protected override get defaultContent(): OptionalContent {
    const { selectedId } = this
    if (!isPopulatedString(selectedId)) {
      // console.warn(this.tagName, 'defaultContent', 'no selectedId')
      return
    }
    return this.control
  }

  private propertyDataType(propertyId: PropertyId): DataType | undefined {
    const event = new EventDataType(propertyId)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    return event.detail.dataType
  }

  protected override willUpdate(values: PropertyValues<this>): void {
    super.willUpdate(values)
    if (values.has('propertyId') || values.has('dataType')) this._control = undefined
  }

  static dataTypeDeclaration: PropertyDeclarations = {
    dataType: { type: String, attribute: 'data-type' },
  }

  static override properties: PropertyDeclarations = {
    ...ControlInputElement.dataTypeDeclaration,
    ...CONTROL_PROPERTY_DECLARATIONS,
  }

  static override styles: CSSResultGroup = [
    Component.cssHostFlex,
    Component.cssBorderBoxSizing,
  ]
}
customElements.define(ControlInputTag, ControlInputElement)
