import type { Encoding, EndpointRequest } from '@moviemasher/runtime-shared'
import type { Application } from 'express'
import type { EncodeStartRequest, StatusRequest, VersionedDataOrError } from '../Api/Api.js'
import type { EncodeServerArgs, ExpressHandler } from './Server.js'

import { ENV_KEY, ENV } from '@moviemasher/lib-server'
import { isEncoding } from '@moviemasher/lib-shared'
import { EventServerEncode, EventServerEncodeStatus, MOVIEMASHER_SERVER } from '@moviemasher/runtime-server'
import { CONTENT_TYPE, ERROR, MASH, MIME_JSON, POST, VERSION, VIDEO, errorCaught, errorObjectCaught, errorThrow, isAssetObject, isDefiniteError, jsonStringify } from '@moviemasher/runtime-shared'
import { Endpoints } from '../Api/Endpoints.js'
import { ServerClass } from './ServerClass.js'
import { idUnique } from '../Hash.js'

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

      const exampleRoot = ENV.get(ENV_KEY.ExampleRoot)
      const event = new EventServerEncode(encodingType, mashAssetObject, user, encodingId, options, exampleRoot)
      MOVIEMASHER_SERVER.eventDispatcher.dispatch(event)
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
    console.log(this.constructor.name, 'status', req.body)
    const { id } = req.body
    try {
      const user = this.userFromRequest(req)
      const event = new EventServerEncodeStatus(id)
      MOVIEMASHER_SERVER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) errorThrow(ERROR.Unimplemented, EventServerEncodeStatus.Type)

      const orError = await promise
      console.log('EncodeServerClass.status', orError)
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