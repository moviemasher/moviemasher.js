import type { PropertyIds, Strings } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup } from 'lit-element/lit-element.js'
import type { ControlGroup, OptionalContent } from '../../declarations.js'

import { ClientActionView, EventControlGroup, ServerActionEncode } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../../Base/Component.js'
import { ControlGroupMixin, ControlGroupProperties, ControlGroupStyles } from '../../Base/ControlGroupMixin.js'
import { ImporterComponent } from '../../Base/ImporterComponent.js'
import { DOT } from '@moviemasher/lib-shared'
import { css } from '@lit/reactive-element/css-tag.js'

const EncodingControlGroupTag = 'movie-masher-control-group-encoding'

const WithControlGroup = ControlGroupMixin(ImporterComponent)
export class EncodingControlGroupElement extends WithControlGroup implements ControlGroup {
  protected override get defaultContent(): OptionalContent {
    const { propertyIds } = this
    if (!propertyIds?.length) return

    this.importTags('movie-masher-action-server')
    this.importTags('movie-masher-action-client')

    return html`
      <movie-masher-action-server
        detail='${ServerActionEncode}'
        icon='${ServerActionEncode}'
        string='${ServerActionEncode}'
      ></movie-masher-action-server>
      <movie-masher-action-client
        icon='visible' 
        string='view'
        detail='${ClientActionView}'
      ></movie-masher-action-client>
    `
  }

  static handleControlGroup(event: EventControlGroup) {
    const { detail } = event
    const { propertyIds, groupedPropertyIds } = detail
    const remainingIds = propertyIds.filter(id => 
      !groupedPropertyIds.includes(id)
    )
    const { names } = EncodingControlGroupElement
    const foundIds = remainingIds.filter(id => names.some(name => id.endsWith(`${DOT}${name}`)))
    if (foundIds.length) {
      // console.log('EncodingControlGroupElement.handleControlGroup', propertyIds, remainingIds, foundIds, names)
      detail.order = 0
      detail.controlGroup = EncodingControlGroupElement.instance(foundIds)
      detail.groupedPropertyIds.push(...foundIds)
      event.stopImmediatePropagation()
    }
  }

  static instance(propertyIds: PropertyIds) {
    const element = document.createElement(EncodingControlGroupTag)
    element.propertyIds = propertyIds
    return element
  }

  private static names: Strings = [
    'encoding',
  ]

  static override properties: PropertyDeclarations = {
    ...ControlGroupProperties,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    ControlGroupStyles,
    css`
      :host {
        gap: var(--gap);
      }
    `
  ]
}

// register web component as custom element
customElements.define(EncodingControlGroupTag, EncodingControlGroupElement)

declare global {
  interface HTMLElementTagNameMap {
    [EncodingControlGroupTag]: EncodingControlGroupElement
  }
}

// listen for control group event
export const ClientGroupEncodingListeners = () => ({
  [EventControlGroup.Type]: EncodingControlGroupElement.handleControlGroup
})
