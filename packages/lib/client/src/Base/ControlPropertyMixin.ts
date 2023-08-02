import type { Constrained, PropertyId, TargetId } from '@moviemasher/runtime-shared'
import type { PropertyDeclarations } from 'lit'
import type { ControlProperty } from '../declarations.js'

import { EventAssetObject, EventChangedAssetObject, EventChangedClipId, EventChangedMashAsset, EventClipId, EventMashAsset, MovieMasher, TypeAsset, TypeMash, isTargetId } from '@moviemasher/runtime-client'
import { DotChar } from '@moviemasher/runtime-shared'
import { Component } from './Component.js'
import { assertDefined } from '@moviemasher/lib-shared'

export function ControlPropertyMixin
<T extends Constrained<Component>>(Base: T): 
T & Constrained<ControlProperty> {
  return class extends Base implements ControlProperty {

    override connectedCallback(): void {
      const { targetId } = this
      if (isTargetId(targetId)) {
        // console.debug(this.tagName, 'connectedCallback listening for changes to', targetId)
        switch (targetId) {
          case TypeAsset: {
            this.listeners[EventChangedAssetObject.Type] = this.handleChangedAssetObject.bind(this)
            break
          }
          case TypeMash: {
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

    protected handleChangedAssetObject(event: EventChangedAssetObject): void {
      const { detail: assetObject } = event
      const id = assetObject?.id
      console.log(this.tagName, 'handleChangedAssetObject', id) 
      this.selectedId = id
    }

    protected handleChangedClipId(event: EventChangedClipId): void {
      const { detail: id } = event
      console.log(this.tagName, 'handleChangedClipId', id)
      this.selectedId = id
    }

    protected handleChangedMashAsset(event: EventChangedMashAsset): void {
      const { detail: mashAsset } = event
      const id = mashAsset?.id  
      console.log(this.tagName, 'handleChangedMashAsset', id)
      this.selectedId = id
    }

    propertyId?: PropertyId
    
    selectedId?: string

    private get selectedIdDefined(): string | undefined {
      const { selectedId } = this
      if (selectedId) return selectedId

      const { targetId } = this
      assertDefined<TargetId>(targetId, 'propertyIdTargetId')

      switch (targetId) {
        case TypeMash: {
          const event = new EventMashAsset() 
          MovieMasher.eventDispatcher.dispatch(event)
          const id = event.detail.mashAsset?.id
          if (!id) console.log(this.tagName, 'selectedIdDefined', targetId, id, event.detail)
          return id
        }
        case TypeAsset: {
          const event = new EventAssetObject() 
          MovieMasher.eventDispatcher.dispatch(event)
          const id = event.detail.assetObject?.id
          if (!id) console.log(this.tagName, 'selectedIdDefined', targetId, id, event.detail)
          return id
        }
        default: {
          const event = new EventClipId()
          MovieMasher.eventDispatcher.dispatch(event)
          const { clipId: id } = event.detail
          if (!id) console.log(this.tagName, 'selectedIdDefined', targetId, id)
          return id
        }
      }
    }
    
    get targetId(): TargetId | undefined {
      const { propertyId } = this
      if (!propertyId) {
        console.warn(this.tagName, 'targetId', 'propertyId undefined')
        return
      }
      const [id] = propertyId.split(DotChar)
      return isTargetId(id) ? id : undefined
    }
  }
}

export const ControlPropertyProperties: PropertyDeclarations = {
  propertyId: { type: String, attribute: 'property-id' },
  selectedId: { type: String, attribute: false },
}
