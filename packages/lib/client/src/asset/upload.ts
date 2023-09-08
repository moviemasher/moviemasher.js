import { assertObject, assertPopulatedString, assertRequest, assertTrue } from '@moviemasher/lib-shared'
import { EventUpload, MovieMasher } from '@moviemasher/runtime-client'
import { UnknownRecord, isDefiniteError } from '@moviemasher/runtime-shared'
import { requestJsonRecordPromise, requestPopulate } from '../utility/request.js'

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
      endpoint: '/file/upload', init: { method: 'POST' }
    }
    const uploadRequest = requestPopulate(jsonRequest, { name, size, type })
    console.debug(EventUpload.Type, 'handleUpload uploadRequest', uploadRequest)

    detail.promise = requestJsonRecordPromise(uploadRequest).then(orError => {
      if (isDefiniteError(orError)) return orError
      progress?.did(1)

      const { data } = orError 
      console.debug(EventUpload.Type, 'handleUpload response', data)

      const { request, storeRequest, fileProperty, id } = data
      assertRequest(storeRequest)
      assertRequest(request)
      assertPopulatedString(id)

      const { init } = storeRequest
      assertObject(init)

      const params: UnknownRecord = { id }
      if (fileProperty) {
        assertPopulatedString(fileProperty)
        params[fileProperty] = file
        
      } else init.body = file

      const populatedRequest = requestPopulate(storeRequest, params)
      console.debug(EventUpload.Type, 'handleUpload populatedRequest', params, populatedRequest)

      return requestJsonRecordPromise(populatedRequest).then(orError => {
        progress?.did(sizeMb)
        return isDefiniteError(orError) ? orError : { data: {request, id } }
      })
    })
  }
}

MovieMasher.eventDispatcher.addDispatchListener(EventUpload.Type, UploadHandler.handleUpload)
