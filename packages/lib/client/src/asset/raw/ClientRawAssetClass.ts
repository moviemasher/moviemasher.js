import type { ClientRawAsset, ClientRawAssetObject, MediaRequest } from '@moviemasher/runtime-client'
import type { Size } from '@moviemasher/runtime-shared'

import { transcodingInstance } from '@moviemasher/lib-shared'
import { ClientAssetClass } from '../ClientAssetClass.js'

export class ClientRawAssetClass extends ClientAssetClass implements ClientRawAsset {
  constructor(...args: any[]) {
    const [object] = args as [ClientRawAssetObject]
    super(object)

    const { request } = object
    this.request = request
  }

  override get assetObject(): ClientRawAssetObject {
    const { request } = this
    return { ...super.assetObject, request }
  }

  override definitionIcon(_: Size): Promise<SVGSVGElement> | undefined { return }

  override initializeProperties(object: ClientRawAssetObject): void {
    const { transcodings } = object
    if (transcodings) this.transcodings.push(...transcodings.map(transcodingInstance))
    super.initializeProperties(object)
  }

  request: MediaRequest
}
