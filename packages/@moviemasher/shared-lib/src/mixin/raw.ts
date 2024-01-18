import type { Asset, Constrained, EndpointRequest, RawAsset, RawAssetObject } from '../types.js'

export function RawAssetMixin<T extends Constrained<Asset>>(Base: T):
  T & Constrained<RawAsset> {
  return class extends Base implements RawAsset {
    override get assetObject(): RawAssetObject {
      const { request } = this
      return { ...super.assetObject, request }
    }
    declare request: EndpointRequest
  }
}
