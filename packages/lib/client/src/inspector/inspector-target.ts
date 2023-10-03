import type { PropertyIds, TargetId } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations } from 'lit'
import type { CSSResultGroup, PropertyValues } from 'lit-element/lit-element.js'
import type { Content, Contents, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { arraySet, assertPopulatedString, sortByOrder } from '@moviemasher/lib-shared'
import { EventChangedAssetId, EventChangedClipId, EventChangedMashAsset, EventControlGroup, EventControlGroupDetail, EventPropertyIds, MovieMasher } from '@moviemasher/runtime-client'
import { ASSET, MASH } from '@moviemasher/runtime-shared'
import { html } from 'lit-html/lit-html.js'
import { Component } from '../Base/Component.js'
import { ImporterComponent } from '../Base/ImporterComponent.js'

export const InspectorTargetElementName = 'movie-masher-inspector-target'
export class InspectorTargetElement extends ImporterComponent {
  private resetListeners(): void {
    const { targetId } = this
    assertPopulatedString(targetId)
    // console.debug(this.tagName, 'connectedCallback listening for changes to', targetId)

    MovieMasher.eventDispatcher.listenersRemove(this.listeners)
    this.listeners = {}
    const { listeners } = this

    switch (targetId) {
      case ASSET: {
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
    MovieMasher.eventDispatcher.listenersAdd(listeners)
  }

  protected override content(contents: Contents): Content {
    return html`<div class='content'>${contents}</div>`
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
      MovieMasher.eventDispatcher.dispatch(event)
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

  private handleChanged(_event: Event) { 
    // console.debug(this.tagName, 'handleChanged', this.targetId, event.type)
    this.requestUpdate() 
  }

  private get selectedPropertyIds(): PropertyIds {
    const { targetId: id } = this
    if (!id) return []
    
    const event = new EventPropertyIds([id])
    MovieMasher.eventDispatcher.dispatch(event)  
    return event.detail.propertyIds
  }

  targetId?: TargetId 

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has('targetId')) {
      // const { targetId } = this
      // console.debug(this.tagName, 'willUpdate', changedProperties.get('targetId'), targetId)
      this.resetListeners()
    }
  }
  static override properties: PropertyDeclarations = {
    targetId: { type: String, attribute: 'target-id' },
  }


  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      div.content > * {
        margin-bottom: var(--inspector-padding);
      }

      div.content > movie-masher-control-row {
        display: block;
        min-height: var(--control-size);
      }
    `
  ]
}

// register web component as custom element
customElements.define(InspectorTargetElementName, InspectorTargetElement)

declare global {
  interface HTMLElementTagNameMap {
    [InspectorTargetElementName]: InspectorTargetElement
  }
}

