import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup } from 'lit-element/lit-element.js'
import type { Contents, ControlGroup, OptionalContent } from '../../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { EventChanged, EventControlGroup, StringEvent, MovieMasher } from '@moviemasher/runtime-client'
import { DotChar, PropertyIds, Strings } from '@moviemasher/runtime-shared'

import { Component } from '../../Base/Component.js'
import { ControlGroupMixin, ControlGroupProperties, ControlGroupStyles } from '../../Base/ControlGroupMixin.js'
import { ImporterComponent } from '../../Base/ImporterComponent.js'

import { End, Crop, DIRECTIONS_SIDE, isChangePropertyAction, POINT_KEYS, ClassSelected, Aspect, AspectFlip } from '@moviemasher/lib-shared'
import { SizeReactiveMixin } from '../../Base/SizeReactiveMixin.js'

const LocationControlGroupElementName = 'movie-masher-control-group-location'

const EventLocationControlGroupType = 'point-control-group'

const WithControlGroup = ControlGroupMixin(ImporterComponent)
const WithSizeReactive = SizeReactiveMixin(WithControlGroup)
const LocationFlippedProperties = {
  top: 'left',
  bottom: 'right',
  left: 'top',
  right: 'bottom'
}

export class LocationControlGroupElement extends WithSizeReactive implements ControlGroup {
  constructor() {
    super()
    this.listeners[EventChanged.Type] = this.handleChanged.bind(this)
    this.listeners[EventLocationControlGroupType] = this.handleDirection.bind(this)
  }

  override connectedCallback(): void {
    const xId = this.namePropertyId(`x${End}`)
    if (xId) {
      const [target] = xId.split(DotChar)
      const key = `control-group-${target}-x`     
      console.debug(this.tagName, 'connectedCallback', key)
      this.listeners[key] = this.handleX.bind(this)
    }
    const yId = this.namePropertyId(`y${End}`)
    if (yId) {
      const [target] = yId.split(DotChar)
      const key = `control-group-${target}-y`     
      console.debug(this.tagName, 'connectedCallback', key)
      this.listeners[key] = this.handleY.bind(this)
    }
    super.connectedCallback()
  }

  private constrainedContent(flipped: boolean): OptionalContent {
    const contents: Contents = DIRECTIONS_SIDE.flatMap(direction => {
      const propertyName = `${direction}${Crop}`
      const propertyId = this.namePropertyId(propertyName)
      if (!propertyId) return []

      const value = this.propertyIdValue(propertyId)
      const icon = flipped ? LocationFlippedProperties[direction] : direction
      return [html`
        <movie-masher-component-a
          emit='${EventLocationControlGroupType}' detail='${direction}'
          icon='${icon}' class='${ifDefined(value ? ClassSelected : undefined)}'
        ></movie-masher-component-a>
      `]
    })
    if (!contents.length) return

    return html`
      <div>
        <movie-masher-component-icon icon='crop'></movie-masher-component-icon>
        ${contents}
      </div>
    `
  }

  protected override get defaultContent(): OptionalContent {
    const { propertyIds, size } = this
    if (!(size && propertyIds?.length)) return

    const aspectFlip = this.propertyIdValue(`point${Aspect}`) === AspectFlip
    const portrait = size.height > size.width
    const aspectIcon = portrait ? 'landscape' : 'portrait' 
    const xIcon = portrait && aspectFlip ? 'y' : 'x'
    const yIcon = portrait && aspectFlip ? 'x' : 'y'
    
    this.importTags('movie-masher-component-icon')
    return html`
      <fieldset>
        <legend>
          <movie-masher-component-icon icon='point'></movie-masher-component-icon>
        </legend>
        ${this.controlContent('x', xIcon)}
        ${this.controlContent('y', yIcon)}
        ${this.constrainedContent(portrait && aspectFlip)}
        ${this.controlContent(`point${Aspect}`, aspectIcon)}
      </fieldset>
    `
  }

  private handleChanged(event: EventChanged) {
    const { detail: action } = event
    if (isChangePropertyAction(action)) {
      const { property } = action
      if (!(
        property.endsWith(End) 
        || property.endsWith(Crop)
        || property.endsWith(Aspect)
      )) return 

      const { propertyIds } = this
      if (propertyIds?.some(id => id.endsWith(`${DotChar}${property}`))) {
        this.requestUpdate()
      }
    }
  }

  private handleDirection(event: StringEvent) {
    const { detail: direction } = event
    const propertyName = `${direction}${Crop}`
    const propertyId = this.namePropertyId(propertyName)
    if (!propertyId) return

    const selectedProperty = this.selectedProperty(propertyId)
    if (!selectedProperty) return

    selectedProperty.changeHandler(propertyName, !selectedProperty.value)
  }

  protected handleX(event: StringEvent) {
    console.debug(this.tagName, 'handleX', event.detail)
    this.addOrRemoveEnd(event.detail, 'x')
    event.stopImmediatePropagation()
  }

  protected handleY(event: StringEvent) {
    console.debug(this.tagName, 'handleY', event.detail)
    this.addOrRemoveEnd(event.detail, 'y')
    event.stopImmediatePropagation()
  }

  static handleControlGroup(event: EventControlGroup) {
    const { detail } = event
    const { propertyIds, groupedPropertyIds } = detail
    const remainingIds = propertyIds.filter(id => 
      !groupedPropertyIds.includes(id)
    )
    const { names } = LocationControlGroupElement
    const foundIds = remainingIds.filter(id => names.some(name => id.endsWith(name)))
    console.log('LocationControlGroupElement.handleControlGroup', propertyIds, remainingIds, foundIds, names)
    if (foundIds.length) {
      detail.order = 1
      detail.controlGroup = LocationControlGroupElement.instance(foundIds)
      detail.groupedPropertyIds.push(...foundIds)
      event.stopImmediatePropagation()
    }
  }

  static instance(propertyIds: PropertyIds) {
    const element = document.createElement(LocationControlGroupElementName)
    element.propertyIds = propertyIds
    return element
  }

  private static names: Strings = [
    ...DIRECTIONS_SIDE.map(direction => `${direction}${Crop}`),
    ...POINT_KEYS.flatMap(key => ([key, `${key}${End}`])),
    `point${Aspect}`,
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
customElements.define(LocationControlGroupElementName, LocationControlGroupElement)

declare global {
  interface HTMLElementTagNameMap {
    [LocationControlGroupElementName]: LocationControlGroupElement
  }
}

// listen for control group event
MovieMasher.eventDispatcher.addDispatchListener(
  EventControlGroup.Type, LocationControlGroupElement.handleControlGroup
)
