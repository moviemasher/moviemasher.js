import type { ClientMashVideoAsset, ClientMashVideoInstance, } from '@moviemasher/runtime-client'
import type { InstanceArgs, MashAssetObject, MashInstanceObject, } from '@moviemasher/runtime-shared'

import { AudibleAssetMixin, AudibleInstanceMixin, VideoAssetMixin, VideoInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, timeFromArgs, } from '@moviemasher/lib-shared'
import { EventAsset } from '@moviemasher/runtime-client'
import { SourceMash, VIDEO, isAssetObject } from '@moviemasher/runtime-shared'
import { NonePreview } from '../../Client/Masher/MashPreview/NonePreview.js'
import { ClientVisibleAssetMixin } from '../../Client/Visible/ClientVisibleAssetMixin.js'
import { ClientVisibleInstanceMixin } from '../../Client/Visible/ClientVisibleInstanceMixin.js'
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

  override initializeProperties(object: MashAssetObject): void {
    this._preview = new NonePreview({ mash: this, time: timeFromArgs() })
    super.initializeProperties(object)
  }

  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, VIDEO, SourceMash)) {
      detail.asset = new ClientMashVideoAssetClass(assetObject)
      event.stopImmediatePropagation()
    }    
  }
}

// listen for video/mash asset event
export const ClientMashVideoListeners = () => ({
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
