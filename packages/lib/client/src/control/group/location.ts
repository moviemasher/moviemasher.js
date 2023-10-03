import type { PropertyIds, Strings } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup } from 'lit-element/lit-element.js'
import type { Contents, ControlGroup, OptionalContent } from '../../declarations.js'

import { AspectFlip, DIRECTIONS_SIDE } from '@moviemasher/lib-shared'
import { ClassSelected, EventChangeScalar, EventControlGroup, MovieMasher, StringEvent } from '@moviemasher/runtime-client'
import { ASPECT, POINT_KEYS, END, CROP, } from '@moviemasher/runtime-shared'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../../Base/Component.js'
import { ControlGroupMixin, ControlGroupProperties, ControlGroupStyles } from '../../Base/ControlGroupMixin.js'
import { ImporterComponent } from '../../Base/ImporterComponent.js'
import { SizeReactiveMixin } from '../../Base/SizeReactiveMixin.js'
import { DOT } from '@moviemasher/lib-shared'

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
    this.listeners[EventLocationControlGroupType] = this.handleDirection.bind(this)
  }

  override connectedCallback(): void {
    const xId = this.namePropertyId(`x${END}`)
    if (xId) {
      const [target] = xId.split(DOT)
      const key = `control-group-${target}-x`     
      this.listeners[key] = this.handleX.bind(this)
    }
    const yId = this.namePropertyId(`y${END}`)
    if (yId) {
      const [target] = yId.split(DOT)
      const key = `control-group-${target}-y`     
      this.listeners[key] = this.handleY.bind(this)
    }
    super.connectedCallback()
  }

  private constrainedContent(flipped: boolean): OptionalContent {
    const contents: Contents = DIRECTIONS_SIDE.flatMap(direction => {
      const propertyName = `${direction}${CROP}`
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

    const aspectFlip = this.propertyIdValue(`point${ASPECT}`) === AspectFlip
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
        ${this.controlContent(`point${ASPECT}`, aspectIcon)}
      </fieldset>
    `
  }

  // private handleChanged(event: EventChanged) {
  //   const { detail: action } = event
  //   if (isChangePropertyAction(action)) {
  //     const { property } = action
  //     if (!(
  //       property.endsWith(END) 
  //       || property.endsWith(CROP)
  //       || property.endsWith(ASPECT)
  //     )) return 

  //     const { propertyIds } = this
  //     if (propertyIds?.some(id => id.endsWith(`${DOT}${property}`))) {
  //       this.requestUpdate()
  //     }
  //   }
  // }

  private handleDirection(event: StringEvent) {
    const { detail: direction } = event
    const propertyName = `${direction}${CROP}`
    const propertyId = this.namePropertyId(propertyName)
    if (!propertyId) return
    
    const scalar = this.propertyIdValue(propertyId)
    MovieMasher.eventDispatcher.dispatch(new EventChangeScalar(propertyId, !scalar))
  }

  protected handleX(event: StringEvent) {
    // console.debug(this.tagName, 'handleX', event.detail)
    this.addOrRemoveEnd(event.detail, 'x')
    event.stopImmediatePropagation()
  }

  protected handleY(event: StringEvent) {
    // console.debug(this.tagName, 'handleY', event.detail)
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
    // console.log('LocationControlGroupElement.handleControlGroup', propertyIds, remainingIds, foundIds, names)
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
    ...DIRECTIONS_SIDE.map(direction => `${direction}${CROP}`),
    ...POINT_KEYS.flatMap(key => ([key, `${key}${END}`])),
    `point${ASPECT}`,
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
