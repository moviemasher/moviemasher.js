import type { ColorAssetObject, ColorInstance, ColorInstanceObject } from '@moviemasher/runtime-shared'

import { EventAsset, MovieMasher } from '@moviemasher/runtime-server'
import { SourceColor, TypeImage, isAssetObject } from '@moviemasher/runtime-shared'

import { ColorAssetMixin, ColorInstanceMixin, DefaultContentId, ServerAssetClass, ServerColorAsset, ServerColorInstance, ServerInstanceClass, ServerVisibleAssetMixin, ServerVisibleInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/lib-shared'

const WithAsset = VisibleAssetMixin(ServerAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithColorAsset = ColorAssetMixin(WithServerAsset)

export class ServerColorAssetClass extends WithColorAsset implements ServerColorAsset {
  instanceFromObject(object?: ColorInstanceObject): ColorInstance {
    const args = this.instanceArgs(object)
    return new ServerColorInstanceClass(args)
  }
  private static _defaultAsset?: ServerColorAsset
  private static get defaultAsset(): ServerColorAsset {
    return this._defaultAsset ||= new ServerColorAssetClass({ 
      id: DefaultContentId, type: TypeImage, 
      source: SourceColor, label: 'Color',
    })
  }
  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject, assetId } = detail
    
    const isDefault = assetId === DefaultContentId
    if (!(isDefault || isAssetObject(assetObject, TypeImage, SourceColor))) return
      
    event.stopImmediatePropagation()
    if (isDefault) detail.asset = ServerColorAssetClass.defaultAsset
    else detail.asset = new ServerColorAssetClass(assetObject as ColorAssetObject) 
  }
}
// listen for image/color asset event
MovieMasher.eventDispatcher.addDispatchListener(
  EventAsset.Type, ServerColorAssetClass.handleAsset
)

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerVisibleInstanceMixin(WithInstance)
const WithColorInstance = ColorInstanceMixin(WithServerInstance)

export class ServerColorInstanceClass extends WithColorInstance implements ServerColorInstance { 
  declare asset: ServerColorAsset
}
