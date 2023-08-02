import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup } from 'lit-element/lit-element.js'
import type { ControlGroup, OptionalContent } from '../../declarations.js'

import { html } from 'lit-html/lit-html.js'

import { EventChanged, EventControlGroup, StringEvent, MovieMasher } from '@moviemasher/runtime-client'
import { DotChar, PropertyIds, Strings } from '@moviemasher/runtime-shared'

import { Component } from '../../Base/Component.js'
import { ControlGroupMixin, ControlGroupProperties, ControlGroupStyles } from '../../Base/ControlGroupMixin.js'
import { ImporterComponent } from '../../Base/ImporterComponent.js'

import { End, isChangePropertyAction } from '@moviemasher/lib-shared'

const FillControlGroupElementName = 'movie-masher-control-group-fill'

const WithControlGroup = ControlGroupMixin(ImporterComponent)
export class FillControlGroupElement extends WithControlGroup implements ControlGroup {
  constructor() {
    super()
    this.listeners[EventChanged.Type] = this.handleChanged.bind(this)
  }

  override connectedCallback(): void {
    const { propertyIds } = this
    if (!propertyIds?.length) {
      console.warn(this.tagName, 'connectedCallback', 'no propertyIds')
      return
    }
    const colorId = this.namePropertyId(`color${End}`)
    if (colorId) {
      const [target] = colorId.split(DotChar)
      const key = `control-group-${target}-color`     
      console.debug(this.tagName, 'connectedCallback', key)
      this.listeners[key] = this.handleColor.bind(this)
    }
    const opacityId = this.namePropertyId(`opacity${End}`)
    if (opacityId) {
      const [target] = opacityId.split(DotChar)
      const key = `control-group-${target}-opacity`     
      console.debug(this.tagName, 'connectedCallback', key)
      this.listeners[key] = this.handleOpacity.bind(this)
    }
    super.connectedCallback()
  }

  protected override get defaultContent(): OptionalContent {
    const { propertyIds } = this
    if (!propertyIds?.length) return

    this.importTags('movie-masher-component-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-component-icon icon='visible'></movie-masher-component-icon>
        </legend>
        ${this.controlContent('color')}
        ${this.controlContent('opacity')}
      </fieldset>
    `
  }

  private handleChanged(event: EventChanged) {
    const { detail: action } = event
    if (isChangePropertyAction(action)) {
      switch (action.property) {
        case 'opacityEnd':
        case 'colorEnd': {
          console.debug(this.tagName, 'handleChanged', action)
          this.requestUpdate()
        }
      }
    }
  }

  protected handleColor(event: StringEvent) {
    console.debug(this.tagName, 'handleColor', event.detail)
    this.addOrRemoveEnd(event.detail, 'color')
    event.stopImmediatePropagation()
  }

  protected handleOpacity(event: StringEvent) {
    console.debug(this.tagName, 'handleOpacity', event.detail)
    this.addOrRemoveEnd(event.detail, 'opacity')
    event.stopImmediatePropagation()
  }

  static handleControlGroup(event: EventControlGroup) {
    const { detail } = event
    const { propertyIds, groupedPropertyIds } = detail
    const remainingIds = propertyIds.filter(id => 
      !groupedPropertyIds.includes(id)
    )
    const { names } = FillControlGroupElement
    const foundIds = remainingIds.filter(id => names.some(name => id.endsWith(name)))
    // console.log('FillControlGroupElement.handleControlGroup', propertyIds, remainingIds, foundIds, names)
    if (foundIds.length) {
      detail.order = 4
      detail.controlGroup = FillControlGroupElement.instance(foundIds)
      detail.groupedPropertyIds.push(...foundIds)
      event.stopImmediatePropagation()
    }
  }

  static instance(propertyIds: PropertyIds) {
    const element = document.createElement(FillControlGroupElementName)
    element.propertyIds = propertyIds
    return element
  }

  private static names: Strings = [
    'color', 'colorEnd', 'opacity', 'opacityEnd'
  ]

  static override properties: PropertyDeclarations = {
    ...ControlGroupProperties,
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Component.cssHostFlex,
    ControlGroupStyles,
  ]
}

// register web component as custom element
customElements.define(FillControlGroupElementName, FillControlGroupElement)

declare global {
  interface HTMLElementTagNameMap {
    [FillControlGroupElementName]: FillControlGroupElement
  }
}

// listen for control group event
MovieMasher.eventDispatcher.addDispatchListener(
  EventControlGroup.Type, FillControlGroupElement.handleControlGroup
)
