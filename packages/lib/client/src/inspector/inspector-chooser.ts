import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup } from 'lit'
import type { Content, Contents, Htmls, OptionalContent } from '../declarations.js'
import type { Strings, SelectorTypes } from '@moviemasher/runtime-shared'
import type { StringEvent } from '@moviemasher/runtime-client'

import { html } from 'lit-html/lit-html.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import {  isArray } from '@moviemasher/runtime-shared'

import { EventInspectorSelectors, EventChangedInspectorSelectors, MovieMasher, TypeMash, TypesTarget, isSelectorType } from '@moviemasher/runtime-client'
import { DisablableMixin, DisablableProperties } from '../Base/DisablableMixin.js'
import { Slotted } from '../Base/Slotted.js'
import { ClassSelected, CommaChar, PipeChar, assertPopulatedString, assertPositive } from '@moviemasher/lib-shared'
import { Component } from '../Base/Component.js'


const EventInspectorChooser = 'inspector-chooser'
const InspectorChooserName = 'movie-masher-inspector-chooser'

const WithDisablable = DisablableMixin(Slotted)
export class InspectorChooserElement extends WithDisablable {
  constructor() {
    super()
    this.listeners[EventInspectorChooser] = this.handleInspectorChooser.bind(this)
    this.listeners[EventInspectorSelectors.Type] = this.handleInspectorSelectors.bind(this)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    const { selectors } = this
    if (!selectors.length) {
      const { parts } = this
      const components = parts.split(PipeChar)
      const [part] = components
      selectors.push(...components)
      this.dispatchChanged(part)
    }
  }

  protected override content(contents: Contents): Content {
    return html`
      <div @export-parts='${this.handleExportParts}'>${contents}</div>
    `
  }

  private dispatchChanged(part: string): void {
    const types = this.partSelectorTypes(part)
    this.selectedPart = part
    const setEvent = new EventChangedInspectorSelectors(types)
    // console.log(this.tagName, 'handleInspectorChooser dispatching EventChangedInspectorSelectors', { types })
    MovieMasher.eventDispatcher.dispatch(setEvent)
  }

  protected handleInspectorChooser(event: StringEvent): void {
    event.stopImmediatePropagation()
    const { detail: part } = event
    // console.log(this.tagName, 'handleInspectorChooser', { part })
    this.dispatchChanged(part)

  }

  protected handleInspectorSelectors(event: EventInspectorSelectors): void {
    const { selectedPart } = this
    const types = this.partSelectorTypes(selectedPart)
    event.stopImmediatePropagation()
    
    const { selectorTypes } = event.detail
    // console.log(this.tagName, 'handleInspectorSelectors', { selectedPart, types })
    selectorTypes.push(...types)
  }

  protected override partContent(part: string, slots: Htmls): OptionalContent {
    const { selectedPart } = this
    this.importTags('movie-masher-component-a')
    return html`
      <movie-masher-component-a 
        class='${ifDefined(selectedPart === part ? ClassSelected : undefined)}'
        icon='${part}' emit='${EventInspectorChooser}' detail='${part}'
      >${slots}</movie-masher-component-a>
    `
  }

  private partSelectorTypes(part: string): SelectorTypes {
    const index = this.parts.split(PipeChar).indexOf(part)
    assertPositive(index)

    const selectorType = this.selectors[index]
    assertPopulatedString(selectorType)

    const selectorTypes = selectorType.split(CommaChar)
    return selectorTypes.filter(isSelectorType)
  }

  protected selectedPart = TypeMash

  selectors: Strings = []
  
  override parts = TypesTarget.join(PipeChar)

  static override properties: PropertyDeclarations = {
    ...DisablableProperties,
    selectedPart: { type: String, attribute: false },
    selectors: { type: Array, converter: {
      fromAttribute: (value: string) => value ? value.split(PipeChar) : TypesTarget,
      toAttribute: (value: Strings) => isArray(value) ? value.join(PipeChar) : ''
    } },
  }
  

  static override styles: CSSResultGroup = [
    // Component.cssHostFlex,
    Component.cssBorderBoxSizing,
    // css`
    //   div {
    //     flex-grow: 1;
    //   }
    // `
  ]
}

// register web component as custom element
customElements.define(InspectorChooserName, InspectorChooserElement)

declare global {
  interface HTMLElementTagNameMap {
    [InspectorChooserName]: InspectorChooserElement
  }
}