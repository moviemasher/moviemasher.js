import type { EndpointRequest } from '@moviemasher/runtime-shared'
import type { Size } from '@moviemasher/runtime-shared'
import type { RawAssetObject } from '@moviemasher/runtime-shared'
import type { ClientRawAsset } from './ClientRawTypes.js'

import { ClientAssetClass } from '../Asset/ClientAssetClass.js'

export class ClientRawAssetClass extends ClientAssetClass implements ClientRawAsset {
  constructor(...args: any[]) {
    const [object] = args as [RawAssetObject]
    super(object)

    const { request } = object
    this.request = request
  }

  definitionIcon(_: Size): Promise<SVGSVGElement> | undefined { return }

  request: EndpointRequest
}
