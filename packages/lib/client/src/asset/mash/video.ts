import type { ClientMashVideoAsset, ClientMashVideoInstance,  } from '@moviemasher/runtime-client'
import type { MashAssetObject, } from '@moviemasher/runtime-shared'

import { AudibleAssetMixin, AudibleInstanceMixin, ClientAudibleAssetMixin, ClientAudibleInstanceMixin, ClientInstanceClass, ClientMashAssetClass, ClientVisibleAssetMixin, ClientVisibleInstanceMixin, NonePreview, VideoAssetMixin, VideoInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, timeFromArgs, } from '@moviemasher/lib-shared'
import { EventAsset, MovieMasher } from '@moviemasher/runtime-client'
import { SourceMash, TypeVideo, isAssetObject } from '@moviemasher/runtime-shared'

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

  override initializeProperties(object: MashAssetObject): void {
    this._preview = new NonePreview({ mash: this, time: timeFromArgs() })
    super.initializeProperties(object)
  }

  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, TypeVideo, SourceMash)) {
      detail.asset = new ClientMashVideoAssetClass(assetObject)
      event.stopImmediatePropagation()
    }    
  }
}

// listen for video/mash asset event
MovieMasher.eventDispatcher.addDispatchListener(
  EventAsset.Type, ClientMashVideoAssetClass.handleAsset
)

const WithAudibleInstance = AudibleInstanceMixin(ClientInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithClientAudibleInstance = ClientAudibleInstanceMixin(WithVisibleInstance)
const WithClientVisibleInstance = ClientVisibleInstanceMixin(WithClientAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(WithClientVisibleInstance)

export class ClientMashVideoInstanceClass extends WithVideoInstance implements ClientMashVideoInstance {
  declare asset: ClientMashVideoAsset
}
