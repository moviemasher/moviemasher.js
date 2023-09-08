import type { DataType, PropertyId } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { OptionalContent } from '../declarations.js'

import { EventControl, EventDataType, MovieMasher } from '@moviemasher/runtime-client'
import { isPopulatedString } from '@moviemasher/runtime-shared'
import { Component } from '../Base/Component.js'
import { ControlPropertyMixin, ControlPropertyProperties } from '../Base/ControlPropertyMixin.js'

const WithControlProperty = ControlPropertyMixin(Component)
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

    const event = new EventControl(type, propertyId)
    MovieMasher.eventDispatcher.dispatch(event)
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
    MovieMasher.eventDispatcher.dispatch(event)
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
    ...ControlPropertyProperties,
  }

  static override styles: CSSResultGroup = [
    Component.cssHostFlex,
    Component.cssBorderBoxSizing,
  ]
}

// register web component as custom element
customElements.define('movie-masher-control-input', ControlInputElement)
