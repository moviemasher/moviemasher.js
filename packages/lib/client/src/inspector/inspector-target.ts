import type { PropertyIds, TargetId } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup, PropertyValues } from 'lit-element/lit-element.js'
import type { Content, Contents, OptionalContent } from '../Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { assertPopulatedString } from '@moviemasher/lib-shared/utility/guards.js'
import { EventChangedAssetId, EventChangedClipId, EventChangedMashAsset, EventControlGroup, EventControlGroupDetail, EventPropertyIds, MOVIEMASHER } from '@moviemasher/runtime-client'
import { ASSET_TARGET, MASH, arraySet, sortByOrder } from '@moviemasher/runtime-shared'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'
import { ImporterComponent } from '../base/Component.js'

const InspectorTargetTag = 'movie-masher-inspector-target'
/**
 * @category Component
 */
export class InspectorTargetElement extends ImporterComponent {
  protected override content(contents: Contents): Content {
    return html`<div class='contents'>${contents}</div>`
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
      // console.log(this.tagName, 'defaultContent grouping', ...propertyIds)
      
      const event = new EventControlGroup(propertyIds, groupedPropertyIds)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      if (!groupedPropertyIds.length) break
      // console.log(this.tagName, 'defaultContent grouped', ...groupedPropertyIds)

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
    const contents: Contents = []
    if (ungroupedPropertyIds.length) {
      // some properties were not grouped
      this.importTags('movie-masher-control-row')
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

  private handleChanged(_: Event) { 
    // console.debug(this.tagName, 'handleChanged', this.targetId, event.type)
    this.requestUpdate() 
  }
  
  private get selectedPropertyIds(): PropertyIds {
    const { targetId: id } = this
    if (!id) return []
    
    const event = new EventPropertyIds([id])
    MOVIEMASHER.eventDispatcher.dispatch(event)  
    const { propertyIds } = event.detail
    // console.log(this.tagName, 'selectedPropertyIds', { id, propertyIds })
    return propertyIds
  }

  targetId?: TargetId 

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has('targetId')) {
      const { targetId } = this
      assertPopulatedString(targetId)
      // console.debug(this.tagName, 'connectedCallback listening for changes to', targetId)

      MOVIEMASHER.eventDispatcher.listenersRemove(this.listeners)
      this.listeners = {}
      const { listeners } = this

      switch (targetId) {
        case ASSET_TARGET: {
          listeners[EventChangedAssetId.Type] = this.handleChanged.bind(this)
          break
        }
        case MASH: {
          listeners[EventChangedMashAsset.Type] = this.handleChanged.bind(this)
          break 
        }
        default: {
          listeners[EventChangedClipId.Type] = this.handleChanged.bind(this)
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

