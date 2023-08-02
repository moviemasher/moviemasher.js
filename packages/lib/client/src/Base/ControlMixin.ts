import type { SelectedProperties, SelectedProperty } from '@moviemasher/runtime-client'
import type { Constrained, Property, Scalar } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations, PropertyValues } from 'lit'
import type { Control, ControlInput, ControlProperty, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { EventChangeFrame, EventChanged, EventSelectedProperties, EventValue, MovieMasher, isPropertyId } from '@moviemasher/runtime-client'
import { isDefined } from '@moviemasher/runtime-shared'
import { Component } from './Component.js'
import { ControlPropertyProperties } from './ControlPropertyMixin.js'

import { End, assertDefined, isAction, isChangeAction, isChangePropertyAction, isPositive } from '@moviemasher/lib-shared'

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
  
      const event = new EventValue(propertyId)
      MovieMasher.eventDispatcher.dispatch(event)
      return isDefined(event.detail.value)
    }
    
    private handleChanged(event: EventChanged): void {
      const { propertyId } = this
      assertDefined(propertyId)

      const { detail: action } = event
      if (!action?.affects.includes(propertyId)) {
        console.debug(this.tagName, propertyId, 'handleChanged NOT AFFECTS?', propertyId, action?.affects)
        return
      }
      if (isChangePropertyAction(action)) {
        const { selectedPropertyOrLoad } = this
        if (!(selectedPropertyOrLoad)) return

        const { value } = action
        // console.log(this.tagName, 'handleChanged', propertyId, selectedPropertyOrLoad.value, '->', value)
        if (value === selectedPropertyOrLoad.value) {
          console.log(this.tagName, propertyId, 'handleChanged NO CHANGE', value)

          return
        }

        this.handleChangedValue(value)
      } else {
        console.log(this.tagName, propertyId, 'handleChanged NOT isChangePropertyAction', isAction(action), isChangeAction(action))
        this.selectedProperty = this.selectedPropertyInitialize  
      }
    }

    private handleChangedValue(value?: Scalar) {
      const { selectedPropertyOrLoad } = this
      if (!selectedPropertyOrLoad) return

      this.setInputValue(value)
      console.log(this.tagName, 'handleChangedValue', selectedPropertyOrLoad.value, '->', value)
      selectedPropertyOrLoad.value = value
    }
    
    handleInput(): void {
      const { selectedProperty, input } = this
      if (!(selectedProperty && input)) return
  
      const { changeHandler, property, frame } = selectedProperty
      const { name } = property
      const { inputValue } = this
      if (isPositive(frame)) {
        if (name.endsWith(End) || this.endValueDefined) {
          console.debug(this.tagName, 'handleInput going to frame', frame, name, inputValue, this.endValueDefined)
          MovieMasher.eventDispatcher.dispatch(new EventChangeFrame(frame))
        }
      }
      this.selectedProperty!.value = inputValue
      changeHandler(name, inputValue)
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
      const { selectedProperty } = this
      if (!selectedProperty) return
  
      const { property, value } = selectedProperty
      const { name, options = [] } = property
      const htmls = options.map(id => html`
        <option ?selected='${value === id}' value='${id}'>${id}</option>
      `)
      return html`
        <select 
          @input='${this.handleInput}'
          name='${name}' 
        >${htmls}</select>
      `
    }

    get inputValue(): Scalar | undefined {
      const { input } = this
      return input ? input.value : undefined
    }

    get property(): Property | undefined {
      return this.selectedPropertyOrLoad?.property
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
          console.warn(this.tagName, 'selectedPropertyInitialize', 'no selectedProperties')
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

    
    setInputValue(value?: Scalar): void {
      const { input } = this
      if (!(input && isDefined(value))) return
      
      if (input instanceof HTMLInputElement && input.type === 'checkbox') {
        input.checked = Boolean(value)
        return
      }
      input.value = String(value)
    }

    protected override willUpdate(changedProperties: PropertyValues<this>): void {
      super.willUpdate(changedProperties)
      if (changedProperties.has('selectedId')) {
        console.debug(this.tagName, 'willUpdate selectedId', this.selectedId)
        this.selectedProperty = this.selectedPropertyInitialize
      }
    }
  }
}

export const ControlProperties: PropertyDeclarations = {
  ...ControlPropertyProperties,
  // selectedProperty: { type: Object, attribute: false },
}
