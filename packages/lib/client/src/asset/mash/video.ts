import {
  AudibleAssetMixin,
  AudibleInstanceMixin,
  ClientAudibleAssetMixin, ClientAudibleInstanceMixin,
  ClientInstanceClass, ClientMashAssetClass,
  ClientVisibleAssetMixin, ClientVisibleInstanceMixin,
  NonePreview,
  VideoAssetMixin, VideoInstanceMixin, VisibleAssetMixin,
  VisibleInstanceMixin,
  isAboveZero, timeFromArgs,
} from '@moviemasher/lib-shared'
import type {
  ClientMashVideoAsset,
  ClientMashVideoInstance,
} from '@moviemasher/runtime-client'
import { ClientAssetManager, MovieMasher } from '@moviemasher/runtime-client'
import type {
  AssetEventDetail, MashAssetObject,
} from '@moviemasher/runtime-shared'
import {
  SourceMash, TypeVideo,
  isAssetObject,
  isBoolean
} from '@moviemasher/runtime-shared'

const WithAudibleAsset = AudibleAssetMixin(ClientMashAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithClientAudibleAsset = ClientAudibleAssetMixin(WithVisibleAsset)
const WithClientVisibleAsset = ClientVisibleAssetMixin(WithClientAudibleAsset)
const WithVideoAsset = VideoAssetMixin(WithClientVisibleAsset)

export class ClientMashVideoAssetClass extends WithVideoAsset implements ClientMashVideoAsset {
  constructor(args: MashAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
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
