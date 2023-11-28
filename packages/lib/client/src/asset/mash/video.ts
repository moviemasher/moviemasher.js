import type { ClientMashVideoAsset, ClientMashVideoInstance, } from '@moviemasher/runtime-client'
import type { InstanceArgs, ListenersFunction, MashAssetObject, MashInstanceObject, } from '@moviemasher/runtime-shared'

import { AudibleAssetMixin, VideoAssetMixin, VisibleAssetMixin } from '@moviemasher/lib-shared/asset/mixins.js'
import { AudibleInstanceMixin, VideoInstanceMixin, VisibleInstanceMixin } from '@moviemasher/lib-shared/instance/mixins.js'
import { EventAsset } from '@moviemasher/runtime-client'
import { MASH, VIDEO, isAssetObject } from '@moviemasher/runtime-shared'
import { ClientVisibleAssetMixin } from '../../mixins/ClientVisibleAssetMixin.js'
import { ClientVisibleInstanceMixin } from '../../mixins/ClientVisibleInstanceMixin.js'
import { ClientInstanceClass } from '../../instance/ClientInstanceClass.js'
import { ClientAudibleAssetMixin } from '../Audible/ClientAudibleAssetMixin.js'
import { ClientAudibleInstanceMixin } from '../Audible/ClientAudibleInstanceMixin.js'
import { ClientMashAssetClass } from './ClientMashAssetClass.js'

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
