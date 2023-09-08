import type { GraphFiles, ServerAsset, ServerPromiseArgs } from '@moviemasher/runtime-server'
import type { AssetObject, InstanceArgs, InstanceObject, PreloadArgs } from '@moviemasher/runtime-shared'

import { AssetClass } from '@moviemasher/lib-shared'
import { EventServerManagedAsset, MovieMasher } from '@moviemasher/runtime-server'
import { assertAsset } from '@moviemasher/runtime-shared'

export class ServerAssetClass extends AssetClass implements ServerAsset {
  override asset(assetId: string | AssetObject): ServerAsset {
    const event = new EventServerManagedAsset(assetId)
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset} = event.detail
    assertAsset(asset)

    return asset
  }

  graphFiles(args: PreloadArgs): GraphFiles {
    throw new Error('Method not implemented.')
  }
  
  serverPromise(_args: ServerPromiseArgs): Promise<void> {
    return Promise.resolve()
  }
  
  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }
}
