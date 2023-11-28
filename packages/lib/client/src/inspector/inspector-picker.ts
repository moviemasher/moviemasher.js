import type { StringEvent } from '@moviemasher/runtime-client'
import type { SelectorTypes, Strings } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Content, Contents, Htmls, OptionalContent } from '../Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { assertPopulatedString, assertPositive } from '@moviemasher/lib-shared/utility/guards.js'
import { EventChangedInspectorSelectors, EventInspectorSelectors, MOVIEMASHER } from '@moviemasher/runtime-client'
import { COMMA, MASH, TARGET_IDS, isArray } from '@moviemasher/runtime-shared'
import { html, nothing } from 'lit-html'
import { Component } from '../base/Component.js'
import { DisablableMixin, DISABLABLE_DECLARATIONS } from '../mixins/component.js'
import { Slotted } from '../base/Component.js'
import { isSelectorType } from '../guards/TypeGuards.js'

const EventInspectorPicker = 'inspector-footer-left'
const InspectorPickerTag = 'movie-masher-inspector-picker'

const InspectorPickerDisablable = DisablableMixin(Slotted)
/**
 * @category Component
 */
export class InspectorPickerElement extends InspectorPickerDisablable {
  constructor() {
    super()
    this.listeners[EventInspectorPicker] = this.handleInspectorChooser.bind(this)
    this.listeners[EventInspectorSelectors.Type] = this.handleInspectorSelectors.bind(this)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    const { selectors } = this
    if (!selectors.length) {
      const { parts } = this
      const components = parts.split(Slotted.partSeparator)
      const [part] = components
      selectors.push(...components)
      this.dispatchChangedInspectorSelectors(part)
    }
  }

  protected override content(contents: Contents): Content {
    return html`
      <div @export-parts='${this.handleExportParts}'>${contents}</div>
    `
  }

  private dispatchChangedInspectorSelectors(part: string): void {
    const types = this.partSelectorTypes(part)
    this.selectedPart = part
    const setEvent = new EventChangedInspectorSelectors(types)
    // console.log(this.tagName, 'handleInspectorChooser dispatching EventChangedInspectorSelectors', { types })
    MOVIEMASHER.eventDispatcher.dispatch(setEvent)
  }

  protected handleInspectorChooser(event: StringEvent): void {
    event.stopImmediatePropagation()
    const { detail: part } = event
    // console.log(this.tagName, 'handleInspectorChooser', { part })
    this.dispatchChangedInspectorSelectors(part)

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
    const selected = selectedPart === part
    return html`<movie-masher-component-a 
        selected='${selected || nothing}'
        icon='${part}' emit='${EventInspectorPicker}' detail='${part}'
      >${slots}</movie-masher-component-a>`
  }

  private partSelectorTypes(part: string): SelectorTypes {
    const index = this.parts.split(Slotted.partSeparator).indexOf(part)
    assertPositive(index)

    const selectorType = this.selectors[index]
    assertPopulatedString(selectorType)

    const selectorTypes = selectorType.split(COMMA)
    return selectorTypes.filter(isSelectorType)
  }

  override parts = TARGET_IDS.join(Slotted.partSeparator)

  protected selectedPart: string = MASH

  selectors: Strings = []
  
  static override properties: PropertyDeclarations = {
    ...DISABLABLE_DECLARATIONS,
    selectedPart: { type: String, attribute: false },
    selectors: { type: Array, converter: {
      fromAttribute: (value: string) => value ? value.split(Slotted.partSeparator) : TARGET_IDS,
      toAttribute: (value: Strings) => isArray(value) ? value.join(Slotted.partSeparator) : ''
    } },
  }

  static override styles: CSSResultGroup = [
    Component.cssHostFlex,
    Component.cssBorderBoxSizing,
    css`
      div {
        flex-grow: 1;
        display: flex;
        gap: var(--gap);
      }
    `
  ]
}

customElements.define(InspectorPickerTag, InspectorPickerElement)

declare global {
  interface HTMLElementTagNameMap {
    [InspectorPickerTag]: InspectorPickerElement
  }
}