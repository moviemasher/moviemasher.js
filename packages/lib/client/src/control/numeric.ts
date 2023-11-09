import type { PropertyDeclarations, CSSResultGroup } from 'lit-element/lit-element.js'
import type { EventControlDetail } from '@moviemasher/runtime-client'
import type { OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { EventControl } from '@moviemasher/runtime-client'
import { Scalar } from '@moviemasher/runtime-shared'
import { DataTypeFrame, DataTypeNumber, DataTypePercent } from '@moviemasher/lib-shared'
import { Component } from '../Base/Component.js'
import { ControlMixin, ControlProperties } from '../Base/ControlMixin.js'
import { ControlPropertyMixin } from '../Base/ControlPropertyMixin.js'

const NumericControlTag = 'movie-masher-control-numeric'

const NumericWithControlProperty = ControlPropertyMixin(Component)
const NumericWithControl = ControlMixin(NumericWithControlProperty)
export class NumericControlElement extends NumericWithControl {
  protected override get defaultContent(): OptionalContent {
    const { property, scalar: value } = this
    if (!property) return

    const { max, min, name, step, type, options } = property
    this.setInputValue(value)
    if (options?.length) return this.inputSelectContent

    return html`
      <input 
        @input='${this.handleInput}'
        type='${type === DataTypePercent ? 'range' : 'number'}'
        name='${name}' 
        aria-label='${name}'
        max='${ifDefined(max)}'
        min='${ifDefined(min)}'
        step='${ifDefined(step)}'
        value='${ifDefined(value)}'
      />
    `
  }

  override get inputValue(): Scalar | undefined {
    const { property, input } = this
    if (!(property && input)) return

    const { step } = property

    const { value: stringValue } = input
    return step === 1 ? parseInt(stringValue) : parseFloat(stringValue)
  }
  

  static instance(detail: EventControlDetail) {
    const { propertyId } = detail
    const element = document.createElement(NumericControlTag)
    element.propertyId = propertyId
    return element
  }

  static handleNode(event: EventControl) {
    const { detail } = event
    const { type } = detail
    if (!NumericControlElement.types.includes(type)) return
    
    detail.control = NumericControlElement.instance(detail)
    event.stopImmediatePropagation()
  }

  static override properties: PropertyDeclarations = {
    ...ControlProperties,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    css`
      input {
        flex-grow: 1;
        width: 100%;
        min-width: 50px;
        height: var(--height-control);
        accent-color: var(--fore);
      }
      input:hover {
        accent-color: var(--over);
      }
    `
  ]

  private static types = [DataTypeFrame, DataTypeNumber, DataTypePercent]
}

// register web component as custom element
customElements.define(NumericControlTag, NumericControlElement)

declare global {
  interface HTMLElementTagNameMap {
    [NumericControlTag]: NumericControlElement
  }
}

// listen for control numeric event
export const ClientControlNumericListeners = () => ({
  [EventControl.Type]: NumericControlElement.handleNode
})

