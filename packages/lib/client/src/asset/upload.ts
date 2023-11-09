import { assertObject, assertPopulatedString, assertRequest, assertTrue } from '@moviemasher/lib-shared'
import { EventUpload } from '@moviemasher/runtime-client'
import { UnknownRecord, isDefiniteError } from '@moviemasher/runtime-shared'
import { requestJsonRecordPromise } from '../utility/request.js'

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
      endpoint: '/upload/request', init: { method: 'POST' }
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
      assertObject(init)

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
export const ClientAssetUploadListeners = () => ({
  [EventUpload.Type]: UploadHandler.handleUpload
})

