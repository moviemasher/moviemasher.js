import type { Constrained, PropertyId, TargetId } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations } from 'lit'
import type { ControlProperty } from '../declarations.js'

import { DOT } from '@moviemasher/lib-shared'
import { EventAssetId, EventChangedAssetId, EventChangedClipId, EventChangedMashAsset, EventClipId, EventMashAsset, MovieMasher } from '@moviemasher/runtime-client'
import { ASSET, MASH } from '@moviemasher/runtime-shared'
import { isTargetId } from '../TypeGuards.js'
import { Component } from './Component.js'

export function ControlPropertyMixin
<T extends Constrained<Component>>(Base: T): 
T & Constrained<ControlProperty> {
  return class extends Base implements ControlProperty {
    override connectedCallback(): void {
      const { targetId } = this
      if (isTargetId(targetId)) {
        // console.debug(this.tagName, 'connectedCallback listening for changes to', targetId)
        switch (targetId) {
          case ASSET: {
            this.listeners[EventChangedAssetId.Type] = this.handleChangedAssetId.bind(this)
            break
          }
          case MASH: {
            this.listeners[EventChangedMashAsset.Type] = this.handleChangedMashAsset.bind(this)
            break
          }
          default: {
            this.listeners[EventChangedClipId.Type] = this.handleChangedClipId.bind(this)
          }
        }
        this.selectedId = this.selectedIdDefined
      }
      super.connectedCallback()
    }

    protected handleChangedAssetId(event: EventChangedAssetId): void {
      this.selectedId = event.detail
    }

    protected handleChangedClipId(event: EventChangedClipId): void {
      const { detail: id } = event
      // console.log(this.tagName, 'handleChangedClipId', id)
      this.selectedId = id
    }

    protected handleChangedMashAsset(event: EventChangedMashAsset): void {
      const { detail: mashAsset } = event
      const id = mashAsset?.id  
      // console.log(this.tagName, 'handleChangedMashAsset', id)
      this.selectedId = id
    }

    propertyId?: PropertyId
    
    selectedId?: string

    private get selectedIdDefined(): string | undefined {
      const { selectedId } = this
      if (selectedId) return selectedId

      const { targetId } = this
      if (!targetId) return

      switch (targetId) {
        case MASH: {
          const event = new EventMashAsset() 
          MovieMasher.eventDispatcher.dispatch(event)
          return event.detail.mashAsset?.id
        }
        case ASSET: {
          const event = new EventAssetId() 
          MovieMasher.eventDispatcher.dispatch(event)
          return event.detail.assetId
        }
        default: {
          const event = new EventClipId()
          MovieMasher.eventDispatcher.dispatch(event)
          return event.detail.clipId
        }
      }
    }
    
    get targetId(): TargetId | undefined {
      const { propertyId } = this
      if (!propertyId) {
        console.warn(this.tagName, 'targetId', 'propertyId undefined')
        return
      }
      const [id] = propertyId.split(DOT)
      return isTargetId(id) ? id : undefined
    }
  }
}

export const ControlPropertyProperties: PropertyDeclarations = {
  propertyId: { type: String, attribute: 'property-id' },
  selectedId: { type: String, attribute: false },
}
