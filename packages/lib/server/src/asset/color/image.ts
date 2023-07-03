import type { 
  ColorInstanceObject, ColorInstance, AssetEventDetail, AssetManager 
} from '@moviemasher/runtime-shared'

import { 
  SourceColor, TypeImage, isAssetObject 
} from '@moviemasher/runtime-shared'
import { 
  MovieMasher 
} from '@moviemasher/runtime-server'

import { 
  ColorAssetMixin, 
  ColorInstanceMixin, ServerAssetClass, 
  ServerColorAsset, ServerColorInstance, ServerInstanceClass, 
  ServerVisibleAssetMixin, ServerVisibleInstanceMixin, VisibleAssetMixin, 
  VisibleInstanceMixin, DefaultContentId
} from '@moviemasher/lib-shared'

const WithAsset = VisibleAssetMixin(ServerAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithColorAsset = ColorAssetMixin(WithServerAsset)

export class ServerColorAssetClass extends WithColorAsset implements ServerColorAsset {
  instanceFromObject(object?: ColorInstanceObject): ColorInstance {
    const args = this.instanceArgs(object)
    return new ServerColorInstanceClass(args)
  }
}

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerVisibleInstanceMixin(WithInstance)
const WithColorInstance = ColorInstanceMixin(WithServerInstance)

export class ServerColorInstanceClass extends WithColorInstance implements ServerColorInstance { 
  declare asset: ServerColorAsset
}

// predefine default image/color asset
(MovieMasher.assetManager as AssetManager).predefine(DefaultContentId, new ServerColorAssetClass({ 
  id: DefaultContentId, type: TypeImage, source: SourceColor, label: 'Color',
}))

// listen for image/color asset event
MovieMasher.eventDispatcher.addDispatchListener<AssetEventDetail>('asset', event => {
  const { detail } = event
  const { assetObject, asset } = detail
  if (!asset && isAssetObject(assetObject, TypeImage, SourceColor)) {
    console.log('ServerColorAssetClass AssetEvent setting asset', assetObject)
    detail.asset = new ServerColorAssetClass(assetObject)
    // console.log('ServerShapeAsset AssetEvent set asset', detail.asset?.label)
    event.stopImmediatePropagation()
  }
})

