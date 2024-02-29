import type { EndpointRequest, FileUploadFunction, UnknownRecord } from '@moviemasher/shared-lib/types.js'

import { $POST, ERROR, errorPromise, errorThrow, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { assertDefined, assertPopulatedString, isRequest } from '@moviemasher/shared-lib/utility/guards.js'
import { requestJsonRecordPromise } from '../utility/request.js'

function assertRequest(value: any, name?: string): asserts value is EndpointRequest {
  if (!isRequest(value)) errorThrow(value, 'Request', name)
}

export const fileUploadFunction: FileUploadFunction = (resource, options = {}) => {
  const { request: assetRequest } = resource
  const { progress } = options

  const { file } = assetRequest
  if (!file) return errorPromise(ERROR.Syntax, 'file')

  const { name, size, type } = file
  const sizeMb = Math.ceil(size / 1024 / 1024)

  progress?.do(sizeMb + 1)
  const jsonRequest = {
    endpoint: '/upload/request', init: { method: $POST }
  }
  return requestJsonRecordPromise(jsonRequest, { name, size, type }).then(orError => {
    if (isDefiniteError(orError)) return orError
    progress?.did(1)

    const { data } = orError 
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
