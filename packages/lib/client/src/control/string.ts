import type { PropertyDeclarations, CSSResultGroup } from 'lit-element/lit-element.js'
import type { EventControlDetail } from '@moviemasher/runtime-client'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { EventControl, MovieMasher } from '@moviemasher/runtime-client'
import { DataTypeString } from '@moviemasher/lib-shared'
import { Component } from '../Base/Component.js'
import { ControlMixin, ControlProperties } from '../Base/ControlMixin.js'
import { OptionalContent } from '../declarations.js'
import { ControlPropertyMixin } from '../Base/ControlPropertyMixin.js'

const StringControlElementName = 'movie-masher-control-string'

const WithControlProperty = ControlPropertyMixin(Component)
const WithControl = ControlMixin(WithControlProperty)
export class StringControlElement extends WithControl {
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
    const element = document.createElement(StringControlElementName)
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
        height: var(--control-size);
      }`
  ]
}

// register web component as custom element
customElements.define(StringControlElementName, StringControlElement)

declare global {
  interface HTMLElementTagNameMap {
    [StringControlElementName]: StringControlElement
  }
}

// listen for control event
MovieMasher.eventDispatcher.addDispatchListener(EventControl.Type, StringControlElement.handleNode)
