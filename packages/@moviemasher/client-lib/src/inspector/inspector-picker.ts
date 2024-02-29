import type { SelectorTypes, Strings } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { TemplateContent, TemplateContents, Htmls, OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { assertPositive, isSelectorType } from '@moviemasher/shared-lib/utility/guards.js'
import { MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { StringEvent, EventChangedInspectorSelectors, EventInspectorSelectors } from '../utility/events.js'
import { COMMA, $MASH, TARGET_IDS } from '@moviemasher/shared-lib/runtime.js'
import { html, nothing } from 'lit-html'
import { Component } from '../base/component.js'
import { DisablableMixin, DISABLABLE_DECLARATIONS } from '../mixin/component.js'
import { ComponentSlotter } from '../base/component.js'
import { isArray } from '@moviemasher/shared-lib/utility/guard.js'

const EventInspectorPicker = 'inspector-footer-left'
export const InspectorPickerTag = 'movie-masher-inspector-picker'

const InspectorPickerDisablable = DisablableMixin(ComponentSlotter)
/**
 * @category Elements
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
      const components = parts.split(ComponentSlotter.partSeparator)
      const [part] = components
      selectors.push(...components)
      this.dispatchChangedInspectorSelectors(part)
    }
  }

  protected override templateContent(contents: TemplateContents): TemplateContent {
    return html`
      <div @export-parts='${this.handleExportParts}'>${contents}</div>
    `
  }

  private dispatchChangedInspectorSelectors(part: string): void {
    const types = this.partSelectorTypes(part)
    this.selectedPart = part
    const setEvent = new EventChangedInspectorSelectors(types)
    MOVIE_MASHER.dispatch(setEvent)
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
    this.loadComponent('movie-masher-link')
    const selected = selectedPart === part
    return html`<movie-masher-link 
        selected='${selected || nothing}'
        icon='${part}' emit='${EventInspectorPicker}' detail='${part}'
      >${slots}</movie-masher-link>`
  }

  private partSelectorTypes(part: string): SelectorTypes {
    const index = this.parts.split(ComponentSlotter.partSeparator).indexOf(part)
    assertPositive(index)

    const selectorType = this.selectors[index]
    const selectorTypes = selectorType.split(COMMA)
    return selectorTypes.filter(isSelectorType)
  }

  override parts = TARGET_IDS.join(ComponentSlotter.partSeparator)

  protected selectedPart: string = $MASH

  selectors: Strings = []
  
  static override properties: PropertyDeclarations = {
    ...DISABLABLE_DECLARATIONS,
    selectedPart: { type: String, attribute: false },
    selectors: { type: Array, converter: {
      fromAttribute: (value: string) => value ? value.split(ComponentSlotter.partSeparator) : TARGET_IDS,
      toAttribute: (value: Strings) => isArray(value) ? value.join(ComponentSlotter.partSeparator) : ''
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