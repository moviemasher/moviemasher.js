import type { Asset, Constrained, EndpointRequest, RawAsset } from '@moviemasher/runtime-shared'


export function RawAssetMixin
<T extends Constrained<Asset>>(Base: T): 
T & Constrained<RawAsset> {
  return class extends Base implements RawAsset {
    declare request: EndpointRequest
  }
}
