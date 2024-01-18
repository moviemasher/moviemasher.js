import type { InstanceArgs, ListenersFunction, MashAssetObject, MashInstanceObject } from '@moviemasher/shared-lib/types.js'
import type { ClientMashVideoAsset, ClientMashVideoInstance } from '../../types.js'

import { AudibleAssetMixin, AudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/audible.js'
import { VideoAssetMixin, VideoInstanceMixin } from '@moviemasher/shared-lib/mixin/video.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { MASH, VIDEO, isAssetObject } from '@moviemasher/shared-lib/runtime.js'
import { ClientInstanceClass } from '../../base/ClientInstanceClass.js'
import { ClientAudibleAssetMixin, ClientAudibleInstanceMixin } from '../../mixin/audible.js'
import { ClientVisibleAssetMixin, ClientVisibleInstanceMixin } from '../../mixin/visible.js'
import { EventAsset } from '../../utility/events.js'
import { ClientMashAssetClass } from './mash.js'

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

  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, VIDEO, MASH)) {
      detail.asset = new ClientMashVideoAssetClass(assetObject)
      event.stopImmediatePropagation()
    }    
  }
}

// listen for video/mash asset event
export const ClientMashVideoListeners: ListenersFunction = () => ({
  [EventAsset.Type]: ClientMashVideoAssetClass.handleAsset
})

const WithAudibleInstance = AudibleInstanceMixin(ClientInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithClientAudibleInstance = ClientAudibleInstanceMixin(WithVisibleInstance)
const WithClientVisibleInstance = ClientVisibleInstanceMixin(WithClientAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(WithClientVisibleInstance)
export class ClientMashVideoInstanceClass extends WithVideoInstance implements ClientMashVideoInstance {
  constructor(args: MashInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  declare asset: ClientMashVideoAsset
}
