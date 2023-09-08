import type { EventControlDetail } from '@moviemasher/runtime-client'
import type { CSSResultGroup, PropertyDeclarations } from 'lit-element/lit-element.js'
import type { Control, OptionalContent } from '../declarations.js'

import { DataTypeBoolean } from '@moviemasher/lib-shared'
import { EventControl, MovieMasher } from '@moviemasher/runtime-client'
import { Scalar } from '@moviemasher/runtime-shared'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../Base/Component.js'
import { ControlMixin, ControlProperties } from '../Base/ControlMixin.js'
import { ControlPropertyMixin } from '../Base/ControlPropertyMixin.js'

const BooleanControlElementName = 'movie-masher-control-boolean'

const WithControlProperty = ControlPropertyMixin(Component)
const WithControl = ControlMixin(WithControlProperty)
export class BooleanControlElement extends WithControl implements Control {
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
    const element = document.createElement(BooleanControlElementName)
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
customElements.define(BooleanControlElementName, BooleanControlElement)

declare global {
  interface HTMLElementTagNameMap {
    [BooleanControlElementName]: BooleanControlElement
  }
}

// listen for control event
MovieMasher.eventDispatcher.addDispatchListener(
  EventControl.Type, BooleanControlElement.handleNode
)
