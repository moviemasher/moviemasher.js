import type { ClientRawAsset, ClientRawAssetObject, ClientMediaRequest, ServerProgress, UploadResult } from '@moviemasher/runtime-client'
import type { DataOrError, Size, StringDataOrError } from '@moviemasher/runtime-shared'

import { transcodingInstance } from '@moviemasher/lib-shared'
import { EventUpload, MovieMasher } from '@moviemasher/runtime-client'
import { isDefiniteError } from '@moviemasher/runtime-shared'
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

  override assetIcon(_: Size): Promise<SVGSVGElement> | undefined { return }

  override initializeProperties(object: ClientRawAssetObject): void {
    const { transcodings } = object
    if (transcodings) this.transcodings.push(...transcodings.map(transcodingInstance))
    super.initializeProperties(object)
  }

  override savePromise(progress?: ServerProgress): Promise<StringDataOrError> {
    const saveRequestPromise = this.saveRequestPromise(progress)
    if (!saveRequestPromise) return super.savePromise(progress)
    
    return saveRequestPromise.then(orError => {
      if (isDefiniteError(orError)) return orError 

      const { data } = orError
      const { id, request } = data
      this.request = request
      this.saveId(id)
      return super.savePromise(progress)
    })
  }

  private saveRequestPromise(progress?: ServerProgress): Promise<DataOrError<UploadResult>> | undefined {
    const { file, objectUrl } = this.request
    if (!file) return
    
    const event = new EventUpload(this.request, progress)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return

    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError 

      if (objectUrl) URL.revokeObjectURL(objectUrl)
      return orError
    })
  }
  request: ClientMediaRequest
}
