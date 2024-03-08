import type { SelectorTypes, Strings } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { TemplateContents, OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { isPropertyId, isTargetId } from '@moviemasher/shared-lib/utility/guards.js'
import { MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventChangedMashAsset, EventChangedInspectorSelectors, EventInspectorSelectors } from '../module/event.js'
import { COMMA, TARGET_IDS } from '@moviemasher/shared-lib/runtime.js'
import { html } from 'lit-html'
import { DisablableMixin, DISABLABLE_DECLARATIONS } from '../mixin/component.js'
import { Scroller } from '../base/component-view.js'
import { isUndefined, isArray } from '@moviemasher/shared-lib/utility/guard.js'

export const InspectorContentCenterTag = 'movie-masher-inspector-content-center'

const InspectorContentCenterDisablable = DisablableMixin(Scroller)

/**
 * @category Elements
 */
export class InspectorContentCenterElement extends InspectorContentCenterDisablable {
  override connectedCallback(): void {
    const { selectorsSupplied } = this
   
    if (isUndefined(selectorsSupplied)) {
      const { selectors } = this
      this.selectorsSupplied = Boolean(selectors.length)
      if (!this.selectorsSupplied) {
        const event = new EventInspectorSelectors()
        MOVIE_MASHER.dispatchCustom(event)
        this.selectors = event.detail.selectorTypes
        this.listeners[EventChangedInspectorSelectors.Type] = this.handleChangedInspectorSelectors.bind(this)
      }
    }
    super.connectedCallback()
  }

  private selectorsSupplied?: boolean
  
  protected override get defaultContent(): OptionalContent {
    const { selectors, disabled } = this
    if (disabled) return

    const { length } = selectors
    const contents: TemplateContents = []
    const propertyIds = length ? selectors.filter(isPropertyId) : []
    const targetIds = length ? selectors.filter(isTargetId) : TARGET_IDS
    if (propertyIds.length) {
      this.loadComponent('movie-masher-control-row')
      propertyIds.forEach(id => {
        contents.push(html`
          <movie-masher-control-row property-id='${id}'></movie-masher-control-row>
        `)
      })
    }
    if (targetIds.length) {
      this.loadComponent('movie-masher-inspector-target')
      contents.push(...targetIds.map(id => html`
        <movie-masher-inspector-target target-id='${id}'></movie-masher-inspector-target>
      `))
    }
    return html`<div class='contents'>${contents}</div>`
  }
  
  filter = ''

  private handleChangedInspectorSelectors(event: EventChangedInspectorSelectors) { 
    if (this.selectorsSupplied) return

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
