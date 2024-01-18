import type { Encoding, EndpointRequest } from '@moviemasher/shared-lib/types.js'
import type { Application } from 'express'
import type { EncodeStartRequest, StatusRequest, VersionedDataOrError } from '../Api/Api.js'
import type { EncodeServerArgs, ExpressHandler } from './Server.js'

import { EventServerEncode, EventServerEncodeStatus } from '@moviemasher/server-lib/runtime.js'
import { ENV, ENV_KEY } from '@moviemasher/server-lib/utility/EnvironmentConstants.js'
import { idUnique } from '@moviemasher/server-lib/utility/Id.js'
import { CONTENT_TYPE, ERROR, MASH, MIME_JSON, MOVIEMASHER, POST, VERSION, VIDEO, errorCaught, errorObjectCaught, errorThrow, isAssetObject, isDefiniteError, jsonStringify } from '@moviemasher/shared-lib/runtime.js'
import { isEncoding } from '@moviemasher/shared-lib/utility/guards.js'
import { Endpoints } from '../Api/Endpoints.js'
import { ServerClass } from './ServerClass.js'

export class EncodeServerClass extends ServerClass {
  constructor(public args: EncodeServerArgs) { super(args) }

  id = 'encode'

  start: ExpressHandler<VersionedDataOrError<EndpointRequest>, EncodeStartRequest> = async (req, res) => {
    const { encodingType = VIDEO, mashAssetObject, encodeOptions: options = {} } = req.body
    try {
      const user = this.userFromRequest(req)
      if (!isAssetObject(mashAssetObject, encodingType, MASH)) {
        errorThrow(ERROR.Syntax, { mashAssetObject })
      }
      const encodingId = idUnique()

      const outputRoot = ENV.get(ENV_KEY.RelativeRequestRoot)
      const event = new EventServerEncode(mashAssetObject, encodingId, options, encodingType, user, outputRoot)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) errorThrow(ERROR.Unimplemented, EventServerEncode.Type)

      res.send({ version : VERSION, data: this.statusEndpointRequest(encodingId) })
    } catch (error) { 
      console.error(this.constructor.name, 'start', error)
      res.send({ version: VERSION, error: errorCaught(error).error })
    }
  }

  startServer(app: Application): Promise<void> {
    return super.startServer(app).then(() => {
      app.post(Endpoints.encode.start, this.start)
      app.post(Endpoints.encode.status, this.status)
    })
  }

  status: ExpressHandler<VersionedDataOrError<EndpointRequest | Encoding>, StatusRequest> = async (req, res) => {
    // console.log(this.constructor.name, 'status', req.body)
    const { id } = req.body
    try {
      const user = this.userFromRequest(req)
      const event = new EventServerEncodeStatus(id)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) errorThrow(ERROR.Unimplemented, EventServerEncodeStatus.Type)

      const orError = await promise
      // console.log('EncodeServerClass.status', orError)
      if (isDefiniteError(orError)) {
        const { error } = orError
        res.send({ version: VERSION, error })
        return
      }
      const { data } = orError
      if (isEncoding(data)) {
        res.send({ version: VERSION, data })
        return
      }
      const timeoutAt = data.getTime() + 1000 * 60 * 10 // 10 minutes
      if (Date.now() > timeoutAt) errorThrow(ERROR.Internal, 'timeout')
 
      res.send({ version: VERSION, data: this.statusEndpointRequest(id) })
    } catch (error) { 
      console.error(this.constructor.name, 'status', error)
      res.send({ version: VERSION, error: errorObjectCaught(error) })
    }
  }

  private statusEndpointRequest(id: string) {
    const data: EndpointRequest = {
      endpoint: { pathname: Endpoints.encode.status },
      init: { 
        method: POST, 
        headers: { [CONTENT_TYPE]: MIME_JSON}, 
        body: jsonStringify({ id }) }
    }
    return data
  }
}