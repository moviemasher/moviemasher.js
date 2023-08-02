import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup } from 'lit-element/lit-element.js'
import type { ControlGroup, OptionalContent } from '../../declarations.js'

import { html } from 'lit-html/lit-html.js'

import { EventChanged, EventControlGroup, MovieMasher } from '@moviemasher/runtime-client'
import { PropertyIds, Strings } from '@moviemasher/runtime-shared'

import { Component } from '../../Base/Component.js'
import { ControlGroupMixin, ControlGroupProperties, ControlGroupStyles } from '../../Base/ControlGroupMixin.js'
import { ImporterComponent } from '../../Base/ImporterComponent.js'
import { ClientActionFlip, isChangePropertyAction } from '@moviemasher/lib-shared'


const AspectControlGroupElementName = 'movie-masher-control-group-aspect'

const WithControlGroup = ControlGroupMixin(ImporterComponent)
export class AspectControlGroupElement extends WithControlGroup implements ControlGroup {
  constructor() {
    super()
    this.listeners[EventChanged.Type] = this.handleChanged.bind(this)
  }
  
  protected override get defaultContent(): OptionalContent {
    const { propertyIds } = this
    if (!propertyIds?.length) return

    const aspectWidthId = this.namePropertyId(`aspectWidth`)
    const aspectHeightId = this.namePropertyId(`aspectHeight`)
    const aspectShortestId = this.namePropertyId(`aspectShortest`)

    const width = Number(aspectWidthId ? this.propertyIdValue(aspectWidthId) : 0)
    const height = Number(aspectHeightId ? this.propertyIdValue(aspectHeightId) : 0)
    const icon = width === height ? 'square' : (width > height ? 'landscape' : 'portrait')

    this.importTags('movie-masher-component-action')
    this.importTags('movie-masher-component-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-component-icon icon='aspect'></movie-masher-component-icon>
        </legend>
        <div>
          <movie-masher-component-icon icon='${icon}'></movie-masher-component-icon>
          ${this.controlInputContent(aspectWidthId)}
          /
          ${this.controlInputContent(aspectHeightId)}
          <movie-masher-component-action 
            icon='${ClientActionFlip}' detail='${ClientActionFlip}'
          ></movie-masher-component-action>
        </div>
        <div>
          <movie-masher-component-icon icon='aspectShortest'></movie-masher-component-icon>
          ${this.controlInputContent(aspectShortestId)} P
        </div>
      </fieldset>
    `
  }

  
  private handleChanged(event: EventChanged) {
    const { detail: action } = event
    if (isChangePropertyAction(action)) {

      switch (action.property) {
        case 'rotate':
        case 'aspectWidth':
        case 'aspectHeight': {
          console.debug(this.tagName, 'handleChanged', action)
          this.requestUpdate()
        }
      }
    } else {
      console.debug(this.tagName, 'handleChanged NOT isChangePropertyAction', action)
    
    }
  }
  
  static handleControlGroup(event: EventControlGroup) {
    const { detail } = event
    const { propertyIds, groupedPropertyIds } = detail
    const remainingIds = propertyIds.filter(id => 
      !groupedPropertyIds.includes(id)
    )
    const { names } = AspectControlGroupElement
    const foundIds = remainingIds.filter(id => names.some(name => id.endsWith(name)))
    // console.log('AspectControlGroupElement.handleControlGroup', propertyIds, remainingIds, foundIds, names)
    if (foundIds.length) {
      detail.order = 1
      detail.controlGroup = AspectControlGroupElement.instance(foundIds)
      detail.groupedPropertyIds.push(...foundIds)
      event.stopImmediatePropagation()
    }
  }

  static instance(propertyIds: PropertyIds) {
    const element = document.createElement(AspectControlGroupElementName)
    element.propertyIds = propertyIds
    return element
  }

  private static names: Strings = [
    'aspectWidth', 'aspectHeight', 'aspectShortest',
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
customElements.define(AspectControlGroupElementName, AspectControlGroupElement)

declare global {
  interface HTMLElementTagNameMap {
    [AspectControlGroupElementName]: AspectControlGroupElement
  }
}

// listen for control group event
MovieMasher.eventDispatcher.addDispatchListener(
  EventControlGroup.Type, AspectControlGroupElement.handleControlGroup
)
