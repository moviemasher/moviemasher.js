import type { EventControlDetail } from '@moviemasher/runtime-client'
import type { CSSResultGroup, PropertyDeclarations } from 'lit-element/lit-element.js'
import type { OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import { html } from 'lit-html/lit-html.js'

import { DataTypeRgb } from '@moviemasher/lib-shared'
import { EventControl, MovieMasher } from '@moviemasher/runtime-client'
import { Component } from '../Base/Component.js'
import { ControlMixin, ControlProperties } from '../Base/ControlMixin.js'
import { ControlPropertyMixin } from '../Base/ControlPropertyMixin.js'

const RgbControlElementName = 'movie-masher-control-rgb'

const WithControlProperty = ControlPropertyMixin(Component)
const WithControl = ControlMixin(WithControlProperty)
export class RgbControlElement extends WithControl {
  protected override get defaultContent(): OptionalContent {
    const { property, scalar: value } = this
    if (!property) {
      console.warn(this.tagName, 'no selectedProperty', this.propertyId)
      return
    }
    const { name } = property
    // console.debug(this.tagName, 'defaultContent', name, value)
    this.setInputValue(value)
    return html`
      <input 
        @input='${this.handleInput}'
        type='color'
        name='${name}' 
        value='${ifDefined(value)}'
      />
    `
  }

  static instance(detail: EventControlDetail) {
    const { propertyId } = detail
    const element = document.createElement(RgbControlElementName)
    element.propertyId = propertyId
    return element
  }

  static handleNode(event: EventControl) {
    const { detail } = event
    const { type } = detail
    if (type !== DataTypeRgb) return
    
    // console.log('RgbControlElement.handleNode', type) 
    detail.control = RgbControlElement.instance(detail)
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
        min-width: 50px;
        width: 100%;
        height: var(--control-size);
      }`
  ]
}

// register web component as custom element
customElements.define(RgbControlElementName, RgbControlElement)

declare global {
  interface HTMLElementTagNameMap {
    [RgbControlElementName]: RgbControlElement
  }
}

// listen for control event
MovieMasher.eventDispatcher.addDispatchListener(EventControl.Type, RgbControlElement.handleNode)
