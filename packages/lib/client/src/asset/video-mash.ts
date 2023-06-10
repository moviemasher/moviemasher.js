import { AssetEventDetail, AudibleAssetMixin, AudibleClientAssetMixin, AudibleClientInstanceMixin, AudibleInstanceMixin, ClientInstanceClass, ClientMashVideoAsset, ClientMashVideoInstance, ClientVisibleAssetMixin, ClientVisibleInstanceMixin, VideoAssetMixin, VideoInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/lib-shared'

import { SourceMash, TypeVideo } from '@moviemasher/runtime-shared'
import { MovieMasher } from '@moviemasher/runtime-client'
import { ClientMashAssetClass, isAssetObject } from '@moviemasher/lib-shared'


const WithAudibleAsset = AudibleAssetMixin(ClientMashAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithClientAudibleAsset = AudibleClientAssetMixin(WithVisibleAsset)
const WithClientVisibleAsset = ClientVisibleAssetMixin(WithClientAudibleAsset)
const WithVideoAsset = VideoAssetMixin(WithClientVisibleAsset)

export class ClientMashVideoAssetClass extends WithVideoAsset implements ClientMashVideoAsset {  

  
  override type = TypeVideo
}

const WithAudibleInstance = AudibleInstanceMixin(ClientInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithClientAudibleInstance = AudibleClientInstanceMixin(WithVisibleInstance)
const WithClientVisibleInstanceD = ClientVisibleInstanceMixin(WithClientAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(WithClientVisibleInstanceD)

export class ClientMashVideoInstanceClass extends WithVideoInstance implements ClientMashVideoInstance {

  declare asset: ClientMashVideoAsset

}

// listen for video/mash asset event
MovieMasher.eventDispatcher.addDispatchListener<AssetEventDetail>('asset', event => {
  const { detail } = event
  const { assetObject, asset } = detail
  if (!asset && isAssetObject(assetObject, TypeVideo, SourceMash)) {
    detail.asset = new ClientMashVideoAssetClass(assetObject)
    event.stopImmediatePropagation()
  }
})
