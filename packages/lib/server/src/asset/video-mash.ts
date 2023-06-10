import type { AssetEventDetail } from '@moviemasher/lib-shared'

import { MovieMasher } from '@moviemasher/runtime-server'
import { ServerMashAssetClass, isAssetObject } from '@moviemasher/lib-shared'
import { SourceMash, TypeVideo } from '@moviemasher/runtime-shared'

// listen for video/mash asset event
MovieMasher.eventDispatcher.addDispatchListener<AssetEventDetail>('asset', event => {
  const { detail } = event
  const { assetObject, asset } = detail
  if (!asset && isAssetObject(assetObject, TypeVideo, SourceMash)) {
    detail.asset = new ServerMashAssetClass(assetObject)
    event.stopImmediatePropagation()
  }
})
