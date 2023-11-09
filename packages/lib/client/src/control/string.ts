import type { EventControlDetail } from '@moviemasher/runtime-client'
import type { CSSResultGroup, PropertyDeclarations } from 'lit-element/lit-element.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { DataTypeString } from '@moviemasher/lib-shared'
import { EventControl } from '@moviemasher/runtime-client'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../Base/Component.js'
import { ControlMixin, ControlProperties } from '../Base/ControlMixin.js'
import { ControlPropertyMixin } from '../Base/ControlPropertyMixin.js'
import { OptionalContent } from '../declarations.js'

const StringControlTag = 'movie-masher-control-string'

const StringWithControlProperty = ControlPropertyMixin(Component)
const StringWithControl = ControlMixin(StringWithControlProperty)
export class StringControlElement extends StringWithControl {
  protected override get defaultContent(): OptionalContent {
    const { property, scalar: value } = this
    if (!property) return

    const { name, options } = property
    this.setInputValue(value)
    
    if (options?.length) return this.inputSelectContent

    return html`
      <input 
        @input='${this.handleInput}'
        type='text'
        name='${name}' 
        aria-label='${name}'
        value='${ifDefined(value)}'
      />
    `
  }

  static instance(detail: EventControlDetail) {
    const { propertyId } = detail
    const element = document.createElement(StringControlTag)
    element.propertyId = propertyId
    return element

  }

  static handleNode(event: EventControl) {
    const { detail } = event
    const { type } = detail
    if (type !== DataTypeString) return
    
    detail.control = StringControlElement.instance(detail)
    event.stopImmediatePropagation()
  }
  static override properties: PropertyDeclarations = {
    ...ControlProperties
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
      }`
  ]
}

// register web component as custom element
customElements.define(StringControlTag, StringControlElement)

declare global {
  interface HTMLElementTagNameMap {
    [StringControlTag]: StringControlElement
  }
}

// listen for control string event
export const ClientControlStringListeners = () => ({
  [EventControl.Type]: StringControlElement.handleNode
})
