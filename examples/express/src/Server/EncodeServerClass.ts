import type { Encoding, EndpointRequest } from '@moviemasher/runtime-shared'
import type { Application } from 'express'
import type { EncodeStartRequest, StatusRequest, VersionedDataOrError } from '../Api/Api.js'
import type { EncodeServerArgs, ExpressHandler } from './Server.js'

import { ENV, ENVIRONMENT, idUnique } from '@moviemasher/lib-server'
import { ContentTypeHeader, JsonMimetype, isEncoding } from '@moviemasher/lib-shared'
import { EventServerEncode, EventServerEncodeStatus, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, MASH, VERSION, VIDEO, errorCaught, errorObjectCaught, errorThrow, isAssetObject, isDefiniteError } from '@moviemasher/runtime-shared'
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

      const exampleRoot = ENVIRONMENT.get(ENV.ExampleRoot)
      const event = new EventServerEncode(encodingType, mashAssetObject, user, encodingId, options, exampleRoot)
      MovieMasher.eventDispatcher.dispatch(event)
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
      MovieMasher.eventDispatcher.dispatch(event)
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
      init: { method: 'POST', headers: { [ContentTypeHeader]: JsonMimetype}, body: JSON.stringify({ id }) }
    }
    return data
  }
}