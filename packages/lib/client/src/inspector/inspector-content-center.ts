import type { EventChangedMashAsset } from '@moviemasher/runtime-client'
import type { SelectorTypes, Strings } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Contents, OptionalContent } from '../Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { isPropertyId } from '@moviemasher/lib-shared/utility/guards.js'
import { EventChangedInspectorSelectors, EventInspectorSelectors, MOVIEMASHER } from '@moviemasher/runtime-client'
import { COMMA, TARGET_IDS, isArray } from '@moviemasher/runtime-shared'
import { html } from 'lit-html'
import { DisablableMixin, DISABLABLE_DECLARATIONS } from '../mixins/component.js'
import { Scroller } from '../base/LeftCenterRight.js'
import { isTargetId } from '../guards/TypeGuards.js'

const InspectorContentCenterTag = 'movie-masher-inspector-content-center'

const InspectorContentCenterDisablable = DisablableMixin(Scroller)

/**
 * @category Component
 */
export class InspectorContentCenterElement extends InspectorContentCenterDisablable {
  constructor() {   
    super()
    this.listeners[EventChangedInspectorSelectors.Type] = this.handleChangedInspectorSelectors.bind(this)
  }

  override connectedCallback(): void {
    const { selectors } = this
    if (selectors.length) return
  
    const selectorTypes: SelectorTypes = []
    MOVIEMASHER.eventDispatcher.dispatch(new EventInspectorSelectors(selectorTypes))
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
    return html`<div class='contents'>${contents}</div>`
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
    ...DISABLABLE_DECLARATIONS,
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
        width: var(--width-inspector);
      }
      
      div.root {
        display: block;
        overflow-y: auto;
      }

      div.contents {
        padding: var(--pad);
      }

      div.contents > * {
        margin-bottom: var(--gap-content);
      }
    `
  ]
}

customElements.define(InspectorContentCenterTag, InspectorContentCenterElement)

declare global {
  interface HTMLElementTagNameMap {
    [InspectorContentCenterTag]: InspectorContentCenterElement
  }
}
