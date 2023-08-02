import {  AudibleAssetMixin, AudibleInstanceMixin, 
  ServerAudibleAssetMixin, ServerAudibleInstanceMixin, 
  ServerInstanceClass, ServerMashVideoAsset, ServerMashVideoInstance, 
  ServerVisibleAssetMixin, ServerVisibleInstanceMixin, VideoAssetMixin, 
  VideoInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin 
} from '@moviemasher/lib-shared'

import { EventAsset, MovieMasher } from '@moviemasher/runtime-server'
import { ServerMashAssetClass,  } from '@moviemasher/lib-shared'
import { MashAssetObject, SourceMash, TypeVideo, isAssetObject } from '@moviemasher/runtime-shared'

const WithAudibleAsset = AudibleAssetMixin(ServerMashAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithServerAudibleAsset = ServerAudibleAssetMixin(WithVisibleAsset)
const WithServerVisibleAsset = ServerVisibleAssetMixin(WithServerAudibleAsset)
const WithVideoAsset = VideoAssetMixin(WithServerVisibleAsset)

export class ServerMashVideoAssetClass extends WithVideoAsset implements ServerMashVideoAsset {
  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, TypeVideo, SourceMash)) {
      detail.asset = new ServerMashVideoAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

const WithAudibleInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithServerAudibleInstance = ServerAudibleInstanceMixin(WithVisibleInstance)
const WithServerVisibleInstance = ServerVisibleInstanceMixin(WithServerAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(WithServerVisibleInstance)

export class ServerMashVideoInstanceClass extends WithVideoInstance implements ServerMashVideoInstance {
 
  declare asset: ServerMashVideoAsset
}

// listen for video/mash asset event
MovieMasher.eventDispatcher.addDispatchListener(
  EventAsset.Type, ServerMashVideoAssetClass.handleAsset
)
