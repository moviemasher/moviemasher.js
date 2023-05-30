import type { Asset, AssetObject } from '../Asset/Asset.js'
import type { EndpointRequest } from '../../Helpers/Request/Request.js'

export interface ImportedAsset extends Asset {
  request: EndpointRequest
}

export type ImportedAssets = ImportedAsset[]

export interface ImportedAssetObject extends AssetObject {
  request: EndpointRequest
}
