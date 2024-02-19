import type { InstanceArgs, ListenersFunction, ShapeAssetObject, ShapeInstanceObject } from '@moviemasher/shared-lib/types.js'
import type { ServerShapeAsset, ServerShapeInstance } from '../type/ServerTypes.js'
import type { ServerAssetManager } from '../types.js'

import { ShapeAssetMixin, ShapeInstanceMixin } from '@moviemasher/shared-lib/mixin/shape.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { DEFAULT_CONTAINER_ID, $IMAGE, $SHAPE, isAssetObject } from '@moviemasher/shared-lib/runtime.js'
import { ServerAssetClass } from '../base/asset.js'
import { ServerInstanceClass } from '../base/instance.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '../mixin/visible.js'
import { EventServerAsset } from '../utility/events.js'

const WithAsset = VisibleAssetMixin(ServerAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithShapeAsset = ShapeAssetMixin(WithServerAsset)
export class ServerShapeAssetClass extends WithShapeAsset implements ServerShapeAsset {
  constructor(args: ShapeAssetObject, manager?: ServerAssetManager) {
    super(args, manager)
    this.initializeProperties(args)
  }
  
  override instanceFromObject(object?: ShapeInstanceObject): ServerShapeInstance {
    const args = this.instanceArgs(object)
    return new ServerShapeInstanceClass(args)
  }

  private static _defaultAsset?: ServerShapeAsset

  private static get defaultAsset(): ServerShapeAsset {
    return this._defaultAsset ||= new ServerShapeAssetClass({ 
      id: DEFAULT_CONTAINER_ID, type: $IMAGE, 
      source: $SHAPE, label: 'Rectangle'
    })
  }
  
  static handleAsset(event: EventServerAsset) {
    const { detail } = event
    const { assetObject, assetId, manager } = detail
    
    const isDefault = assetId === DEFAULT_CONTAINER_ID
    if (!(isDefault || isAssetObject(assetObject, $IMAGE, $SHAPE))) return
      
    event.stopImmediatePropagation()
    if (isDefault) detail.asset = ServerShapeAssetClass.defaultAsset
    else detail.asset = new ServerShapeAssetClass(assetObject as ShapeAssetObject, manager) 
  }
}

// listen for image/shape asset event
export const ServerShapeImageListeners: ListenersFunction = () => ({
  [EventServerAsset.Type]: ServerShapeAssetClass.handleAsset
})

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerVisibleInstanceMixin(WithInstance)
const WithShapeInstance = ShapeInstanceMixin(WithServerInstance)
export class ServerShapeInstanceClass extends WithShapeInstance implements ServerShapeInstance { 
  constructor(args: ShapeInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }
  
  declare asset: ServerShapeAsset
}

