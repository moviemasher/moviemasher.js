import type { EventChangedMashAsset } from '@moviemasher/runtime-client'
import type { SelectorTypes, Strings } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Contents, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html/lit-html.js'

import { isPropertyId, COMMA } from '@moviemasher/lib-shared'
import { EventInspectorSelectors, EventChangedInspectorSelectors, MovieMasher, } from '@moviemasher/runtime-client'
import { TARGET_IDS, isArray } from '@moviemasher/runtime-shared'
import { DisablableMixin, DisablableProperties } from '../Base/DisablableMixin.js'
import { Scroller } from '../Base/Scroller.js'
import { isTargetId } from '../TypeGuards.js'

export const InspectorContentElementName = 'movie-masher-inspector-content'

const WithDisablable = DisablableMixin(Scroller)
export class InspectorContentElement extends WithDisablable {
  constructor() {   
    super()
    this.listeners[EventChangedInspectorSelectors.Type] = this.handleChangedInspectorSelectors.bind(this)
  }

  override connectedCallback(): void {
    const { selectors } = this
    if (selectors.length) return
  
    const selectorTypes: SelectorTypes = []
    MovieMasher.eventDispatcher.dispatch(new EventInspectorSelectors(selectorTypes))
    this.selectors = selectorTypes

    super.connectedCallback()
  }

  protected override get defaultContent(): OptionalContent {
    const { selectors, disabled } = this
    if (disabled) return

    const { length } = selectors
    const contents: Contents = []
    const propertyIds = length ? selectors.filter(isPropertyId) : []
    const targetIds = length ? selectors.filter(isTargetId) : TARGET_IDS
    if (propertyIds.length) {
      this.importTags('movie-masher-control-row')
      propertyIds.forEach(id => {
        contents.push(html`
          <movie-masher-control-row property-id='${id}'></movie-masher-control-row>
        `)
      })
    }
    if (targetIds.length) {
      this.importTags('movie-masher-inspector-target')
      contents.push(...targetIds.map(id => html`
        <movie-masher-inspector-target target-id='${id}'></movie-masher-inspector-target>
      `))
    }
    return html`<div class='content'>${contents}</div>`
  }
  
  filter = ''

  private handleChangedInspectorSelectors(event: EventChangedInspectorSelectors) { 
    const { filter: eventFilter, selectorTypes } = event.detail
    const { filter } = this
    if (filter && filter !== eventFilter) return

    this.selectors = selectorTypes
  }

  override handleChangedMashAsset(event: EventChangedMashAsset): void {
    super.handleChangedMashAsset(event)
    if (event.detail) this.requestUpdate('clipId', undefined)
  }

  selectors: SelectorTypes = []

  static override properties: PropertyDeclarations = {
    ...DisablableProperties,
    selectors: { type: Array, converter: {
      fromAttribute: (value: string) => value ? value.split(COMMA) : [],
      toAttribute: (value: Strings) => isArray(value) ? value.join(COMMA) : ''
    } },
    filter: { type: String },
  }

  static override styles: CSSResultGroup = [
    Scroller.styles,
    css`
      :host {
        width: var(--inspector-width);
      }
      
      div.root {
        display: block;
        overflow-y: auto;
      }

      div.content { 
        padding: var(--inspector-padding);
      }
      div.content > * {
        margin-bottom: var(--inspector-padding);
      }
    `
  ]
}

// register web component as custom element
customElements.define(InspectorContentElementName, InspectorContentElement)

declare global {
  interface HTMLElementTagNameMap {
    [InspectorContentElementName]: InspectorContentElement
  }
}

