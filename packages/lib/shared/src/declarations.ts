import { Asset, AssetObject  } from './Shared/Asset/AssetTypes.js'


export interface AssetEventDetail {
  assetObject: AssetObject
  asset?: Asset
}

export type AssetEvent = CustomEvent<AssetEventDetail>

export interface AssetPromiseEventDetail {
  assetObject: AssetObject
  assetPromise?: Promise<Asset>
}

export type AssetPromiseEvent = CustomEvent<AssetPromiseEventDetail>

