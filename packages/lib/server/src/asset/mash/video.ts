import {  AudibleAssetMixin, AudibleInstanceMixin, 
  ServerAudibleAssetMixin, ServerAudibleInstanceMixin, 
  ServerInstanceClass, ServerMashVideoAsset, ServerMashVideoInstance, 
  ServerVisibleAssetMixin, ServerVisibleInstanceMixin, VideoAssetMixin, 
  VideoInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin 
} from '@moviemasher/lib-shared'

import { MovieMasher, ServerAssetManager } from '@moviemasher/runtime-server'
import { ServerMashAssetClass,  } from '@moviemasher/lib-shared'
import { AssetEventDetail, MashAssetObject, SourceMash, TypeVideo, isAssetObject } from '@moviemasher/runtime-shared'

const WithAudibleAsset = AudibleAssetMixin(ServerMashAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithServerAudibleAsset = ServerAudibleAssetMixin(WithVisibleAsset)
const WithServerVisibleAsset = ServerVisibleAssetMixin(WithServerAudibleAsset)
const WithVideoAsset = VideoAssetMixin(WithServerVisibleAsset)

export class ServerMashVideoAssetClass extends WithVideoAsset implements ServerMashVideoAsset {
  override initializeProperties(object: MashAssetObject): void {
    this.media = MovieMasher.assetManager as ServerAssetManager
    super.initializeProperties(object)
  }
}

const WithAudibleInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithServerAudibleInstance = ServerAudibleInstanceMixin(WithVisibleInstance)
const WithServerVisibleInstanceD = ServerVisibleInstanceMixin(WithServerAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(WithServerVisibleInstanceD)

export class ServerMashVideoInstanceClass extends WithVideoInstance implements ServerMashVideoInstance {
 
  declare asset: ServerMashVideoAsset
}

// listen for video/mash asset event
MovieMasher.eventDispatcher.addDispatchListener<AssetEventDetail>('asset', event => {
  const { detail } = event
  const { assetObject, asset } = detail
  if (!asset && isAssetObject(assetObject, TypeVideo, SourceMash)) {
    detail.asset = new ServerMashVideoAssetClass(assetObject)
    event.stopImmediatePropagation()
  }
})
