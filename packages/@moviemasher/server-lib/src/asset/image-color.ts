import type { ColorAssetObject, ColorInstanceObject, InstanceArgs, ListenersFunction } from '@moviemasher/shared-lib/types.js'
import type { ServerColorAsset, ServerColorInstance } from '../type/ServerTypes.js'

import { EventServerAsset } from '../runtime.js'
import { COLOR, IMAGE, DEFAULT_CONTENT_ID, isAssetObject } from '@moviemasher/shared-lib/runtime.js'
import { ServerAssetClass } from '../base/asset.js'
import { ServerInstanceClass } from '../base/instance.js'
import { ServerVisibleAssetMixin } from '../mixin/visible.js'
import { ServerVisibleInstanceMixin } from '../mixin/visible.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { ColorAssetMixin, ColorInstanceMixin } from '@moviemasher/shared-lib/mixin/color.js'


const WithAsset = VisibleAssetMixin(ServerAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithColorAsset = ColorAssetMixin(WithServerAsset)
export class ServerColorAssetClass extends WithColorAsset implements ServerColorAsset {
  constructor(args: ColorAssetObject) {
    super(args)
    this.initializeProperties(args)
  }

  override instanceFromObject(object?: ColorInstanceObject): ServerColorInstance {
    const args = this.instanceArgs(object)
    return new ServerColorInstanceClass(args)
  }

  private static _defaultAsset?: ServerColorAsset

  static get defaultAsset(): ServerColorAsset {
    return this._defaultAsset ||= new ServerColorAssetClass({ 
      id: DEFAULT_CONTENT_ID, type: IMAGE, 
      source: COLOR, label: 'Color',
    })
  }

  static handleAsset (event: EventServerAsset) {
    const { detail } = event
    const { assetObject, assetId } = detail
    
    const isDefault = assetId === DEFAULT_CONTENT_ID
    if (!(isDefault || isAssetObject(assetObject, IMAGE, COLOR))) return
      
    event.stopImmediatePropagation()
    if (isDefault) detail.asset = ServerColorAssetClass.defaultAsset
    else detail.asset = new ServerColorAssetClass(assetObject as ColorAssetObject) 
  }
}

// listen for image/color asset event
export const colorServerListeners: ListenersFunction = () => ({
  [EventServerAsset.Type]: ServerColorAssetClass.handleAsset
}) 

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerVisibleInstanceMixin(WithInstance)
const WithColorInstance = ColorInstanceMixin(WithServerInstance)
export class ServerColorInstanceClass extends WithColorInstance implements ServerColorInstance { 
  constructor(args: ColorInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }
  
  declare asset: ServerColorAsset
}

