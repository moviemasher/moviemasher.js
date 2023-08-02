import type { EventControlDetail } from '@moviemasher/runtime-client'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit-element/lit-element.js'
import type { Control, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'

import { DataTypeContainerId, DataTypeContentId } from '@moviemasher/lib-shared'
import { EventControl, MovieMasher } from '@moviemasher/runtime-client'
import { Component } from '../Base/Component.js'
import { ControlMixin, ControlProperties } from '../Base/ControlMixin.js'
import { ControlPropertyMixin } from '../Base/ControlPropertyMixin.js'

const AssetControlElementName = 'movie-masher-control-asset'

const WithControlProperty = ControlPropertyMixin(Component)
const WithControl = ControlMixin(WithControlProperty)
export class AssetControlElement extends WithControl implements Control {
  protected override get defaultContent(): OptionalContent {
    const { selectedProperty } = this
    if (!selectedProperty) return html`NO PROP for ${this.propertyId}`

    const { value } = selectedProperty
    return html`VALUE: ${value}`
  }

  static instance(args: EventControlDetail) {
    const { propertyId } = args
    const element = document.createElement(AssetControlElementName)
    element.propertyId = propertyId

    return element
  }

  static handleNode(event: EventControl) {
    const { detail } = event
    const { type } = detail
    if (![DataTypeContainerId, DataTypeContentId].includes(type)) return
    
    detail.control = AssetControlElement.instance(detail)
    event.stopImmediatePropagation()
  }

  static override properties: PropertyDeclarations = {
    ...ControlProperties,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    css`
      :host {
        --ratio-preview-inspector: var(--ratio-preview, 0.20);
      }
    `
  ]
}

// register web component as custom element
customElements.define(AssetControlElementName, AssetControlElement)

declare global {
  interface HTMLElementTagNameMap {
    [AssetControlElementName]: AssetControlElement
  }
}

// listen for control event
MovieMasher.eventDispatcher.addDispatchListener(
  EventControl.Type, AssetControlElement.handleNode
)
