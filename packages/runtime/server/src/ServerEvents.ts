import { AssetObject, ManageType } from '@moviemasher/runtime-shared'
import { ServerAsset } from './ServerAsset.js'

export interface AssetEventDetail {
  assetId: string
  assetObject?: AssetObject
  asset?: ServerAsset
}

/**
 * Dispatch to retrieve a managed asset from an asset id or object.
 */
export class EventManagedAsset extends CustomEvent<AssetEventDetail> {
  static Type = 'managed-asset'
  constructor(assetIdOrObject: string | AssetObject) { 
    const string = typeof assetIdOrObject === 'string' 
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail = { assetId, assetObject }
    super(EventManagedAsset.Type, { detail }) 
  }
}

/**
 * Dispatch to retrieve an asset from an asset id or object.
 */
export class EventAsset extends CustomEvent<AssetEventDetail> {
  static Type = 'asset'
  constructor(assetIdOrObject: string | AssetObject) { 
    const string = typeof assetIdOrObject === 'string' 
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail = { assetId, assetObject }
    super(EventAsset.Type, { detail }) 
  }
}


/**
 * Dispatch to release managed assets.
 */
export class EventReleaseManagedAssets extends CustomEvent<string | undefined> {
  static Type = 'release-assets'
  constructor(detail?: ManageType) { 
    super(EventReleaseManagedAssets.Type, { detail }) 
  }
}
