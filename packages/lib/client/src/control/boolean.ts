import type { EventControlDetail } from '@moviemasher/runtime-client'
import type { CSSResultGroup, PropertyDeclarations } from 'lit-element/lit-element.js'
import type { Control, OptionalContent } from '../declarations.js'

import { DataTypeBoolean } from '@moviemasher/lib-shared'
import { EventControl } from '@moviemasher/runtime-client'
import { Scalar } from '@moviemasher/runtime-shared'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../Base/Component.js'
import { ControlMixin, ControlProperties } from '../Base/ControlMixin.js'
import { ControlPropertyMixin } from '../Base/ControlPropertyMixin.js'

const BooleanControlTag = 'movie-masher-control-boolean'

const BooleanWithControlProperty = ControlPropertyMixin(Component)
const BooleanWithControl = ControlMixin(BooleanWithControlProperty)
export class BooleanControlElement extends BooleanWithControl implements Control {
  protected override get defaultContent(): OptionalContent {
    const { property, scalar: value } = this
    if (!property) return

    const { name } = property
    return html`
      <input 
        @input='${this.handleInput}'
        ?checked='${Boolean(value)}'
        type='checkbox'
        name='${name}' 
        aria-label='${name}'
      />
    `
  }

  override get inputValue(): Scalar | undefined {
    const { input } = this
    return input ? (input as HTMLInputElement).checked : undefined
  }

  static instance(args: EventControlDetail) {
    const { propertyId } = args
    const element = document.createElement(BooleanControlTag)
    element.propertyId = propertyId
    return element
  }

  static handleNode(event: EventControl) {
    const { detail } = event
    const { type } = detail
    if (type !== DataTypeBoolean) return
    
    detail.control = BooleanControlElement.instance(detail)
    event.stopImmediatePropagation()
  }

  static override properties: PropertyDeclarations = {
    ...ControlProperties,
  }


  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
  ]
}

// register web component as custom element
customElements.define(BooleanControlTag, BooleanControlElement)

declare global {
  interface HTMLElementTagNameMap {
    [BooleanControlTag]: BooleanControlElement
  }
}

// listen for control boolean event
export const ClientControlBooleanListeners = () => ({
  [EventControl.Type]: BooleanControlElement.handleNode
})

