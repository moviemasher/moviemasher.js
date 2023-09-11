import type { CommandFile, GraphFiles, ServerAsset, ServerPromiseArgs } from '@moviemasher/runtime-server'
import type { AssetObject, DataOrError, InstanceArgs, InstanceObject, PreloadArgs } from '@moviemasher/runtime-shared'

import { AssetClass } from '@moviemasher/lib-shared'
import { EventServerManagedAsset, MovieMasher } from '@moviemasher/runtime-server'
import { assertAsset, isAsset } from '@moviemasher/runtime-shared'

export class ServerAssetClass extends AssetClass implements ServerAsset {
  override asset(assetId: string | AssetObject): ServerAsset {
    const event = new EventServerManagedAsset(assetId)
    MovieMasher.eventDispatcher.dispatch(event)
    const { asset} = event.detail
    if (!isAsset(asset)) console.error('Could not construct asset from', assetId)
    assertAsset(asset)

    return asset
  }

  graphFiles(_args: PreloadArgs): GraphFiles { return [] }
  
  serverPromise(_args: ServerPromiseArgs, _commandFile: CommandFile): Promise<DataOrError<number>> {
    return Promise.resolve({ data: 0 })
  }
  
  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }
}
