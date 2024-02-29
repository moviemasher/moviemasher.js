import type { AssetFunction } from '@moviemasher/shared-lib/types.js'
import type { ClientMashVideoAsset, ClientMashVideoInstance } from '../types.js'

import { AudibleAssetMixin, AudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/audible.js'
import { VideoAssetMixin, VideoInstanceMixin } from '@moviemasher/shared-lib/mixin/video.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { ClientInstanceClass } from '@moviemasher/shared-lib/base/client-instance.js'
import { ClientAudibleAssetMixin, ClientAudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/client-audible.js'
import { ClientVisibleAssetMixin, ClientVisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/client-visible.js'
import { ClientMashAssetClass } from '../source/mash/mash.js'
import { $MASH, $VIDEO, ERROR, SLASH, isAssetObject, namedError } from '@moviemasher/shared-lib/runtime.js'

const WithAudibleAsset = AudibleAssetMixin(ClientMashAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithClientAudibleAsset = ClientAudibleAssetMixin(WithVisibleAsset)
const WithClientVisibleAsset = ClientVisibleAssetMixin(WithClientAudibleAsset)
const WithVideoAsset = VideoAssetMixin(WithClientVisibleAsset)
export class ClientMashVideoAssetClass extends WithVideoAsset implements ClientMashVideoAsset {}

export const videoMashAssetFunction: AssetFunction = (assetObject) => {
  if (!isAssetObject(assetObject, $VIDEO, $MASH)) {
    return namedError(ERROR.Syntax, [$VIDEO, $MASH].join(SLASH))
  }
  return { data: new ClientMashVideoAssetClass(assetObject) }
}

const WithAudibleInstance = AudibleInstanceMixin(ClientInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithClientAudibleInstance = ClientAudibleInstanceMixin(WithVisibleInstance)
const WithClientVisibleInstance = ClientVisibleInstanceMixin(WithClientAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(WithClientVisibleInstance)
export class ClientMashVideoInstanceClass extends WithVideoInstance implements ClientMashVideoInstance {
  declare asset: ClientMashVideoAsset
}
