import type { 
 ClientMashVideoAsset, 
  ClientMashVideoInstance, 
  

} from '@moviemasher/lib-shared'
import type { 
  AssetEventDetail, MashAssetObject,
} from '@moviemasher/runtime-shared'
import { 
   SourceMash, TypeVideo, 
  isBoolean, isAssetObject 
} from '@moviemasher/runtime-shared'
import { ClientAssetManager, MovieMasher } from '@moviemasher/runtime-client'
import { 
  
   NonePreview, ClientVisibleAssetMixin, ClientVisibleInstanceMixin,
  VideoAssetMixin, VideoInstanceMixin, VisibleAssetMixin, 
  VisibleInstanceMixin, AudibleAssetMixin, ClientAudibleAssetMixin, ClientAudibleInstanceMixin, 
  AudibleInstanceMixin, ClientInstanceClass, ClientMashAssetClass, 
  isAboveZero, timeFromArgs, 
} from '@moviemasher/lib-shared'


const WithAudibleAsset = AudibleAssetMixin(ClientMashAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithClientAudibleAsset = ClientAudibleAssetMixin(WithVisibleAsset)
const WithClientVisibleAsset = ClientVisibleAssetMixin(WithClientAudibleAsset)
const WithVideoAsset = VideoAssetMixin(WithClientVisibleAsset)

export class ClientMashVideoAssetClass extends WithVideoAsset implements ClientMashVideoAsset {
  declare media: ClientAssetManager
  
  override initializeProperties(object: MashAssetObject): void {
    const { loop, buffer } = object 
    if (isBoolean(loop)) this.loop = loop
    if (isAboveZero(buffer)) this._buffer = buffer
    this._preview = new NonePreview({ mash: this, time: timeFromArgs() })

    this.media = MovieMasher.assetManager 
    super.initializeProperties(object)
  }
}

const WithAudibleInstance = AudibleInstanceMixin(ClientInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithClientAudibleInstance = ClientAudibleInstanceMixin(WithVisibleInstance)
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
