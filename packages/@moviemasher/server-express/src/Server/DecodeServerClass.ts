import type { Decoding, EndpointRequest } from '@moviemasher/shared-lib/types.js'
import type { Application } from 'express'
import type { DecodeStartRequest, StatusRequest, VersionedDataOrError } from '../Api/Api.js'
import type { DecodeServerArgs, ExpressHandler } from './Server.js'

import { assertProbingOptions, idUnique } from '@moviemasher/server-lib'
import { EventServerDecode, EventServerDecodeStatus } from '@moviemasher/server-lib/runtime.js'
import { CONTENT_TYPE, ERROR, MIME_JSON, MOVIEMASHER, POST, VERSION, VIDEO, errorCaught, errorObjectCaught, errorThrow, isDecoding, isDefiniteError, jsonStringify } from '@moviemasher/shared-lib/runtime.js'
import { Endpoints } from '../Api/Endpoints.js'
import { ServerClass } from './ServerClass.js'

export class DecodeServerClass extends ServerClass {
  constructor(public args: DecodeServerArgs) { super(args) }

  id = 'decode'

  decode: ExpressHandler<VersionedDataOrError<EndpointRequest>, DecodeStartRequest> = async (req, res) => {
    const { decodingType = VIDEO, request, options = {}, assetType } = req.body
    try {
      const user = this.userFromRequest(req)
      assertProbingOptions(options)

      const id = idUnique()
      const event = new EventServerDecode(decodingType, assetType, request, user, id, options)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) errorThrow(ERROR.Unimplemented, EventServerDecode.Type)
    
      res.send({ version : VERSION, data: this.statusEndpointRequest(id) })
    } catch (error) { 
      console.error(this.constructor.name, 'start', error)
      res.send({ version: VERSION, error: errorCaught(error).error })
    }
  }

  startServer(app: Application): Promise<void> {
    return super.startServer(app).then(() => {
      app.post(Endpoints.decode.start, this.decode)
      app.post(Endpoints.decode.status, this.status)
    })
  }

  status: ExpressHandler<VersionedDataOrError<EndpointRequest | Decoding>, StatusRequest> = async (req, res) => {
    // console.log(this.constructor.name, 'status', req.body)
    const { id } = req.body
    try {
      const user = this.userFromRequest(req)
      const event = new EventServerDecodeStatus(id)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      // console.log(this.constructor.name, 'status', !!promise)
      if (!promise) errorThrow(ERROR.Unimplemented, EventServerDecodeStatus.Type)

      const orError = await promise
      if (isDefiniteError(orError)) {
        const { error } = orError
        res.send({ version: VERSION, error })
        return
      }
      const { data } = orError
      if (isDecoding(data)) {
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
      endpoint: { pathname: Endpoints.decode.status },
      init: { 
        method: POST, headers: { [CONTENT_TYPE]: MIME_JSON}, 
        body: jsonStringify({ id }) 
      }
    }
    return data
  }
}