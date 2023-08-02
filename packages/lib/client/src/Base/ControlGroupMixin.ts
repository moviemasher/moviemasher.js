import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup } from 'lit-element/lit-element.js'
import type { Constrained, DataType, PropertyId, PropertyIds, Scalar } from '@moviemasher/runtime-shared'
import type { ControlGroup, OptionalContent } from '../declarations.js'
import type { SelectedProperty } from '@moviemasher/runtime-client'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { DotChar, isDefined } from '@moviemasher/runtime-shared'
import { End } from '@moviemasher/lib-shared'
import { EventChangedClipId, EventSelectedProperties, EventValue, MovieMasher, isPropertyId } from '@moviemasher/runtime-client'


import { ImporterComponent } from './ImporterComponent.js'

export function ControlGroupMixin
<T extends Constrained<ImporterComponent>>(Base: T): 
T & Constrained<ControlGroup> {
  return class extends Base implements ControlGroup {
    constructor(...args: any[]) {
      super(...args)
      this.listeners[EventChangedClipId.Type] = this.handleChangedClipId.bind(this)
    }

    addOrRemoveEnd(addOrRemove: string, propertyNamePrefix: string): void {
      const value = this.currentValue(propertyNamePrefix, addOrRemove)
      const endName = `${propertyNamePrefix}${End}`
      const endPropertyId = this.namePropertyId(endName)
      console.debug(this.tagName, 'addOrRemoveEnd', { addOrRemove, endPropertyId, value })
      if (!endPropertyId) return

      const selectedProperty = this.selectedProperty(endPropertyId)
      if (!selectedProperty) return

      console.log(this.tagName, 'addOrRemoveEnd', selectedProperty.propertyId)
      selectedProperty.changeHandler(endName, value)
    }

    controlContent(name: string, icon?: string): OptionalContent {
      const id = this.namePropertyId(name)
      if (!id) return

      const iconName = icon || name

      this.importTags('movie-masher-component-icon')
      return html`
        <div>
          <movie-masher-component-icon icon='${iconName}'></movie-masher-component-icon>
          ${this.controlInputContent(id)}
          ${this.controlInputContentEnd(name)}
        </div>
      `
    }

    controlInputContent(propertyId?: PropertyId, dataType?: DataType): OptionalContent {
      if (!propertyId) return

      this.importTags('movie-masher-control-input')
      return html`
        <movie-masher-control-input 
          property-id='${propertyId}' data-type='${ifDefined(dataType)}'
        ></movie-masher-control-input>
      `
    }

    controlInputContentEnd(namePrefix: string): OptionalContent {
      const { propertyIds } = this
      const endName = `${namePrefix}${End}`
      const endPropertyId = propertyIds?.find(id => id.endsWith(endName))
      if (!endPropertyId) return

      const [target] = endPropertyId.split(DotChar)
  
      this.importTags('movie-masher-component-a')
      const event = new EventValue(endPropertyId)
      MovieMasher.eventDispatcher.dispatch(event)
      const defined = isDefined(event.detail.value)
      const addOrRemove = defined ? 'remove' : 'add'
      const input = defined ? this.controlInputContent(endPropertyId): undefined
      return html`
        ${input}
        <movie-masher-component-a
          emit='control-group-${target}-${namePrefix}' 
          detail='${addOrRemove}' 
          icon='${addOrRemove}-circle'
        ></movie-masher-component-a>
      `
    }

    currentValue(name: string, addOrRemove: string): Scalar | undefined  {
      if (addOrRemove === 'remove') return

      // const name = `${widthOrHeight}${End}`
      const found = this.namePropertyId(name)
      if (!found) return

      return this.propertyIdValue(found)
    }
      
    private handleChangedClipId() { 
      //this.requestUpdate()
    }

    namePropertyId(name: string): PropertyId | undefined {
      return this.propertyIds?.find(id => id.endsWith(name))
    }

    propertyIds?: PropertyIds

    selectedProperty(propertyId: PropertyId): SelectedProperty | undefined {
      const propertiesEvent = new EventSelectedProperties([propertyId])
      MovieMasher.eventDispatcher.dispatch(propertiesEvent)
      const { selectedProperties } = propertiesEvent.detail
      if (!selectedProperties?.length) {
        console.warn(this.tagName, 'addOrRemoveEnd', 'no selected properties')
        return
      }
      const [selectedProperty] = selectedProperties
      return selectedProperty
    }

    propertyIdValue(found: string): Scalar | undefined {
      const propertyId = isPropertyId(found) ? found : this.namePropertyId(found)
      if (!propertyId) return

      const event = new EventValue(propertyId)
      MovieMasher.eventDispatcher.dispatch(event)
      return event.detail.value 
    }

    propertyNameContent(name: string): OptionalContent {
      const { propertyIds } = this
      const id = propertyIds?.find(id => id.endsWith(name))
      if (!id) return
  
      this.importTags('movie-masher-component-icon')
      return html`
        <div>
          <movie-masher-component-icon icon='${name}'></movie-masher-component-icon>
          ${this.controlInputContent(id)}
        </div>
      `
    }
  }
}

export const ControlGroupStyles: CSSResultGroup = [
  css`
    fieldset {
      flex-grow: 1;
      line-height: var(--control-size);
      font-size: var(--control-size);
      padding: var(--control-spacing);
      background-color: initial;
    }
    
    fieldset > div {
      display: flex;
      gap: var(--control-spacing);
      grid-auto-flow: column;
      margin-bottom: var(--control-spacing);
    }
  `
]

export const ControlGroupProperties: PropertyDeclarations = {
  propertyIds: { type: Array },
}