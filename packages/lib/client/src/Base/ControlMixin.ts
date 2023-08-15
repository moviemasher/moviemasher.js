import type { SelectedProperties, SelectedProperty } from '@moviemasher/runtime-client'
import type { Constrained, Property, Scalar } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations, PropertyValues } from 'lit'
import type { Control, ControlInput, ControlProperty, OptionalContent } from '../declarations.js'

import { End } from '@moviemasher/runtime-shared'
import { EventChangeFrame, EventChangeScalar, EventChanged, EventScalar, EventSelectedProperties, EventTimeRange, MovieMasher, isPropertyId } from '@moviemasher/runtime-client'
import { isDefined } from '@moviemasher/runtime-shared'
import { html } from 'lit-html/lit-html.js'
import { Component } from './Component.js'
import { ControlPropertyProperties } from './ControlPropertyMixin.js'

export function ControlMixin
<T extends Constrained<Component & ControlProperty>>(Base: T): 
T & Constrained<Control> {
  return class extends Base implements Control {
    constructor(...args: any[]) {
      super(...args)
      this.listeners[EventChanged.Type] = this.handleChanged.bind(this)
    }
  
    get endValueDefined(): boolean {
      const { propertyId } = this
      if (!propertyId) return false
  
      const event = new EventScalar(`${propertyId}${End}`)
      MovieMasher.eventDispatcher.dispatch(event)
      return isDefined(event.detail.value)
    }
    
    private handleChanged(event: EventChanged): void {
      const { propertyId } = this
      if (!propertyId) return

      const { detail: action } = event
      if (!action?.affects.includes(propertyId)) return
      
      this.setInputValue(this.scalar)
    }

    handleInput(): void {
      const { selectedProperty, input, propertyId } = this
      if (!(selectedProperty && input && propertyId)) return
  
      const { inputValue } = this
      const isEnd = propertyId.endsWith(End)
      if (isEnd || this.endValueDefined) {
        // console.debug(this.tagName, propertyId, 'handleInput END DEFINED')
        const event = new EventTimeRange()
        MovieMasher.eventDispatcher.dispatch(event)
        const { detail: { timeRange } } = event
        if (timeRange) {
          const frame = isEnd ? timeRange.last : timeRange.frame
          // console.debug(this.tagName, propertyId, 'handleInput GOING', frame)
          MovieMasher.eventDispatcher.dispatch(new EventChangeFrame(frame))
        }
      }
      // console.debug(this.tagName, this.propertyId, 'handleInput', inputValue)
      selectedProperty.value = inputValue

      MovieMasher.eventDispatcher.dispatch(new EventChangeScalar(propertyId, inputValue))
    }

    get input(): ControlInput | undefined {
      const { shadowRoot } = this
      if (!shadowRoot) return

      return (
        shadowRoot.querySelector('input') 
        || shadowRoot.querySelector('select')  
        ||  undefined
      )
    }

    get inputSelectContent(): OptionalContent {
      const { property } = this
      if (!property) return
    
      const { name, options = [] } = property
      const value = this.scalar
      const htmls = options.map(id => html`
        <option ?selected='${value === id}' value='${id}'>${id}</option>
      `)
      return html`
        <select @input='${this.handleInput}' name='${name}'>${htmls}</select>
      `
    }

    get inputValue(): Scalar | undefined {
      const { input } = this
      return input ? input.value : undefined
    }

    get property(): Property | undefined {
      return this.selectedPropertyOrLoad?.property
    }

    get scalar(): Scalar | undefined {
      const { propertyId } = this
      if (!propertyId) return

      const event = new EventScalar(propertyId)
      MovieMasher.eventDispatcher.dispatch(event)
      return event.detail.value
    }

    selectedProperty?: SelectedProperty

    private get selectedPropertyOrLoad(): SelectedProperty | undefined {
      return this.selectedProperty ||= this.selectedPropertyInitialize
    }

    private get selectedPropertyInitialize(): SelectedProperty | undefined {
      const { propertyId } = this
      if (!isPropertyId(propertyId)) {
        console.warn(this.tagName, 'selectedPropertyInitialize', 'no propertyId')
        return
      }
      const selectedProperties: SelectedProperties = []
      const event = new EventSelectedProperties([propertyId], selectedProperties)
      MovieMasher.eventDispatcher.dispatch(event)
      const { length } = selectedProperties
      switch (length) {
        case 0: {
          // console.warn(this.tagName, 'selectedPropertyInitialize', 'no selectedProperties')
          return
        }
        case 1: break
        default: {
          console.warn(this.tagName, 'selectedPropertyInitialize', length, 'selectedProperties')
        }
      }
      const [property] = selectedProperties
      return property
    }

    setInputValue(value?: Scalar): boolean {
      const { input } = this
      if (!(input && isDefined(value))) return false
      
      if (value === this.inputValue) return false

      if (input instanceof HTMLInputElement && input.type === 'checkbox') {
        input.checked = Boolean(value)
      } else input.value = String(value)        
      return true
    }

    protected override willUpdate(changedProperties: PropertyValues<this>): void {
      super.willUpdate(changedProperties)
      if (changedProperties.has('selectedId')) {
        // console.debug(this.tagName, 'willUpdate selectedId', this.selectedId)
        this.selectedProperty = this.selectedPropertyInitialize
      }
    }
  }
}

export const ControlProperties: PropertyDeclarations = {
  ...ControlPropertyProperties,
  // selectedProperty: { type: Object, attribute: false },
}
