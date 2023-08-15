import type { SelectedProperty } from '@moviemasher/runtime-client'
import type { Constrained, DataType, PropertyId, PropertyIds, Scalar } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup } from 'lit-element/lit-element.js'
import type { ControlGroup, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { End } from '@moviemasher/runtime-shared'
import { EventChangeScalar, EventChanged, EventScalar, EventSelectedProperties, MovieMasher, isPropertyId } from '@moviemasher/runtime-client'
import { DotChar, isDefined } from '@moviemasher/runtime-shared'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import { html } from 'lit-html/lit-html.js'
import { ImporterComponent } from './ImporterComponent.js'

export function ControlGroupMixin
<T extends Constrained<ImporterComponent>>(Base: T): 
T & Constrained<ControlGroup> {
  return class extends Base implements ControlGroup {
    constructor(...args: any[]) {
      super(...args)
      this.listeners[EventChanged.Type] = this.handleChanged.bind(this)
    }

    addOrRemoveEnd(addOrRemove: string, propertyNamePrefix: string): void {
      const value = this.currentValue(propertyNamePrefix, addOrRemove)
      const endName = `${propertyNamePrefix}${End}`
      const endPropertyId = this.namePropertyId(endName)
      if (!endPropertyId) {
        console.warn(this.tagName, 'addOrRemoveEnd', { endPropertyId, addOrRemove, value })
        return
      }
      console.log(this.tagName, 'addOrRemoveEnd', endPropertyId)
      MovieMasher.eventDispatcher.dispatch(new EventChangeScalar(endPropertyId, value))
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
      const event = new EventScalar(endPropertyId)
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

    private handleChanged(event: EventChanged) {
      const { detail: action } = event
      if (!action) return
  
      const { propertyIds } = this
      if (!propertyIds?.length) return
  
      const { affects } = action
      const found = propertyIds.some(id => affects.includes(id))
      if (found) {
        // console.debug(this.tagName, 'handleChanged', action)
        this.requestUpdate()
      }
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

      const event = new EventScalar(propertyId)
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

    fieldset > legend > movie-masher-component-icon,
    fieldset > div > movie-masher-component-icon  {
      display: inline-block;
      min-width: 1em;
      min-height: 1em;
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