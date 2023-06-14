import type { RawAsset, RawAssetObject } from '@moviemasher/runtime-shared'
import type { EndpointRequest } from '@moviemasher/runtime-shared'

import { ServerAssetClass } from '../Asset/ServerAssetClass.js'


export class ServerRawAssetClass extends ServerAssetClass implements RawAsset {
  constructor(object: RawAssetObject) {
    super(object)
    const { request } = object
    this.request = request
  }
  
  request: EndpointRequest
}
