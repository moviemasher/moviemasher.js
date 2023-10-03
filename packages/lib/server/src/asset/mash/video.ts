import type { InstanceArgs, MashInstanceObject, MashVideoAssetObject } from '@moviemasher/runtime-shared'
import type { ServerMashVideoAsset, ServerMashVideoInstance } from '../../Types/ServerMashTypes.js'

import { AudibleAssetMixin, AudibleInstanceMixin, VideoAssetMixin, VideoInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/lib-shared'
import { EventServerAsset } from '@moviemasher/runtime-server'
import { MASH, VIDEO, isAssetObject } from '@moviemasher/runtime-shared'
import { ServerAudibleAssetMixin } from '../../Base/ServerAudibleAssetMixin.js'
import { ServerAudibleInstanceMixin } from '../../Base/ServerAudibleInstanceMixin.js'
import { ServerMashAssetClass } from './ServerMashClasses.js'
import { ServerInstanceClass } from '../../Base/ServerInstanceClass.js'
import { ServerVisibleAssetMixin } from '../../Base/ServerVisibleAssetMixin.js'
import { ServerVisibleInstanceMixin } from '../../Base/ServerVisibleInstanceMixin.js'

const WithAudibleAsset = AudibleAssetMixin(ServerMashAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithServerAudibleAsset = ServerAudibleAssetMixin(WithVisibleAsset)
const WithServerVisibleAsset = ServerVisibleAssetMixin(WithServerAudibleAsset)
const WithVideoAsset = VideoAssetMixin(WithServerVisibleAsset)

export class ServerMashVideoAssetClass extends WithVideoAsset implements ServerMashVideoAsset {
  constructor(args: MashVideoAssetObject) {
    super(args)
    this.initializeProperties(args)
  }

  
  static handleAsset(event: EventServerAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, VIDEO, MASH)) {
      detail.asset = new ServerMashVideoAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for video/mash asset event
export const ServerMashVideoListeners = () => ({
  [EventServerAsset.Type]: ServerMashVideoAssetClass.handleAsset
})

const WithAudibleInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithServerAudibleInstance = ServerAudibleInstanceMixin(WithVisibleInstance)
const WithServerVisibleInstance = ServerVisibleInstanceMixin(WithServerAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(WithServerVisibleInstance)

export class ServerMashVideoInstanceClass extends WithVideoInstance implements ServerMashVideoInstance {
  constructor(args: MashInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }
  
  declare asset: ServerMashVideoAsset
}
