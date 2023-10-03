import type { CommandFile, GraphFiles, ServerAsset, ServerPromiseArgs } from '@moviemasher/runtime-server'
import type { AssetObject, DataOrError, InstanceArgs, InstanceObject, CacheArgs } from '@moviemasher/runtime-shared'

import { AssetClass } from '@moviemasher/lib-shared'
import { EventServerManagedAsset } from '@moviemasher/runtime-server'

export class ServerAssetClass extends AssetClass implements ServerAsset {
  override asset(assetId: string | AssetObject): ServerAsset {
    return EventServerManagedAsset.asset(assetId)
  }

  assetGraphFiles(_args: CacheArgs): GraphFiles { return [] }
  
  serverPromise(_args: ServerPromiseArgs, _commandFile: CommandFile): Promise<DataOrError<number>> {
    return Promise.resolve({ data: 0 })
  }
  
  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }
}
