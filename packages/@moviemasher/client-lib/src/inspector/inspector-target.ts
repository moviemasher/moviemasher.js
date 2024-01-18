import type { PropertyIds, TargetId } from '@moviemasher/shared-lib/types.js'
import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup, PropertyValues } from 'lit-element/lit-element.js'
import type { TemplateContent, TemplateContents, OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { assertPopulatedString } from '@moviemasher/shared-lib/utility/guards.js'
import { MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'
import { EventChangedAssetId, EventChangedClipId, EventChangedMashAsset, EventControlGroup, EventPropertyIds } from '../utility/events.js'
import { EventControlGroupDetail } from '../types.js'
import { ASSET_TARGET, MASH, arraySet, sortByOrder } from '@moviemasher/shared-lib/runtime.js'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'
import { ComponentLoader } from '../base/Component.js'

export const InspectorTargetTag = 'movie-masher-inspector-target'
/**
 * @category Elements
 */
export class InspectorTargetElement extends ComponentLoader {
  protected override templateContent(contents: TemplateContents): TemplateContent {
    return html`<div @request-update='${this.handleChanged}' class='contents'>${contents}</div>`
  }

  protected override get defaultContent(): OptionalContent { 
    const { selectedPropertyIds } = this
    const groupDetails: EventControlGroupDetail[] = []

    if (!selectedPropertyIds.length) return 

    const propertyIds: PropertyIds = [...selectedPropertyIds]
    const groupedPropertyIds: PropertyIds = [...selectedPropertyIds]
    const usedPropertyIds: PropertyIds = []

    while(groupedPropertyIds.length && propertyIds.length) {
      groupedPropertyIds.length = 0

      // see if anyone wants to group some of the remaining selected properties
      const event = new EventControlGroup(propertyIds, groupedPropertyIds)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      if (!groupedPropertyIds.length) break

      const { detail } = event
      const { controlGroup } = detail
      if (!controlGroup) break

      groupDetails.push(detail)
      usedPropertyIds.push(...groupedPropertyIds)
      arraySet(propertyIds, propertyIds.filter(id => 
        !groupedPropertyIds.includes(id))
      )
    }
    const groupedControls: Node[] = []
    if (groupDetails.length) {
      groupDetails.sort(sortByOrder)
      groupDetails.forEach(detail => {
        const { controlGroup } = detail
        if (!controlGroup) return

        groupedControls.push(controlGroup)
      })
    }
    const ungroupedPropertyIds = selectedPropertyIds.filter(propertyId => 
      !usedPropertyIds.includes(propertyId)
    )
    const contents: TemplateContents = []
    if (ungroupedPropertyIds.length) {
      // some properties were not grouped
      this.loadComponent('movie-masher-control-row')
      contents.push(...ungroupedPropertyIds.map(propertyId => 
        html`
          <movie-masher-control-row 
            property-id='${propertyId}' 
          ></movie-masher-control-row>
        `)          
      )
    }
    contents.push(...groupedControls)
    return html`${contents}`
  }

  private handleChanged(event: Event) { 
    event.stopImmediatePropagation()
    this.requestUpdate() 
  }
  
  private get selectedPropertyIds(): PropertyIds {
    const { targetId } = this
    if (!targetId) return []
    
    const event = new EventPropertyIds([targetId])
    MOVIEMASHER.eventDispatcher.dispatch(event)  
    const { propertyIds } = event.detail
    return propertyIds
  }

  targetId?: TargetId 

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has('targetId')) {
      const { targetId } = this
      assertPopulatedString(targetId)

      MOVIEMASHER.eventDispatcher.listenersRemove(this.listeners)
      this.listeners = {}
      const { listeners } = this

      const bound = this.handleChanged.bind(this)
      switch (targetId) {
        case ASSET_TARGET: {
          listeners[EventChangedAssetId.Type] = bound
          break
        }
        case MASH: {
          listeners[EventChangedMashAsset.Type] = bound
          break 
        }
        default: {
          listeners[EventChangedClipId.Type] = bound
        }
      }   
      MOVIEMASHER.eventDispatcher.listenersAdd(listeners)
    }
  }

  static override properties: PropertyDeclarations = {
    targetId: { type: String, attribute: 'target-id' },
  }

  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      div.contents > * {
        margin-bottom: var(--gap-content);
      }

      div.contents > movie-masher-control-row {
        display: block;
        min-height: var(--height-control);
      }
    `
  ]
}

customElements.define(InspectorTargetTag, InspectorTargetElement)

declare global {
  interface HTMLElementTagNameMap {
    [InspectorTargetTag]: InspectorTargetElement
  }
}

