import type { EndpointRequest, ListenersFunction, UnknownRecord } from '@moviemasher/shared-lib/types.js'

import { assertDefined, assertPopulatedString, assertTrue, isRequest } from '@moviemasher/shared-lib/utility/guards.js'
import { EventUpload } from '../utility/events.js'
import { $POST, errorThrow, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { requestJsonRecordPromise } from '../utility/request.js'

function assertRequest(value: any, name?: string): asserts value is EndpointRequest {
  if (!isRequest(value)) errorThrow(value, 'Request', name)
}

export class UploadHandler {
  static handleUpload(event: EventUpload): void {
    event.stopImmediatePropagation()
    const { detail } = event
    const { request: assetRequest, progress } = detail
    const { file } = assetRequest
    assertTrue(file) 

    const { name, size, type } = file
    const sizeMb = Math.ceil(size / 1024 / 1024)

    progress?.do(sizeMb + 1)
    const jsonRequest = {
      endpoint: '/upload/request', init: { method: $POST }
    }
    detail.promise = requestJsonRecordPromise(jsonRequest, { name, size, type }).then(orError => {
      if (isDefiniteError(orError)) return orError
      progress?.did(1)

      const { data } = orError 
      // console.debug(EventUpload.Type, 'handleUpload response', data)

      const { assetRequest, storeRequest, fileProperty, id } = data
      assertRequest(storeRequest)
      assertRequest(assetRequest)
      assertPopulatedString(id)

      const { init } = storeRequest
      assertDefined(init)

      const params: UnknownRecord = { id }
      if (fileProperty) {
        assertPopulatedString(fileProperty)
        params[fileProperty] = file
        
      } else init.body = file
      return requestJsonRecordPromise(storeRequest, params).then(orError => {
        progress?.did(sizeMb)
        return isDefiniteError(orError) ? orError : { data: { assetRequest, id } }
      })
    })
  }
}

// listen for client upload event
export const ClientAssetUploadListeners: ListenersFunction = () => ({
  [EventUpload.Type]: UploadHandler.handleUpload
})
