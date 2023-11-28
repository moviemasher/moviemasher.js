import type { CommandFile, GraphFiles, ServerAsset, ServerPromiseArgs } from '@moviemasher/runtime-server'
import type { AssetObject, CacheArgs, DataOrError, InstanceArgs, InstanceObject } from '@moviemasher/runtime-shared'

import { AssetClass } from '@moviemasher/lib-shared/base/asset.js'
import { EventServerManagedAsset, MOVIEMASHER_SERVER } from '@moviemasher/runtime-server'
import { assertAsset } from '@moviemasher/runtime-shared'

export class ServerAssetClass extends AssetClass implements ServerAsset {
  override asset(assetId: string | AssetObject): ServerAsset {
    const event = new EventServerManagedAsset(assetId)
    MOVIEMASHER_SERVER.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    assertAsset(asset)
    
    return asset
  }

  assetGraphFiles(_args: CacheArgs): GraphFiles { return [] }
  
  serverPromise(_args: ServerPromiseArgs, _commandFile: CommandFile): Promise<DataOrError<number>> {
    return Promise.resolve({ data: 0 })
  }
  
  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }
}
