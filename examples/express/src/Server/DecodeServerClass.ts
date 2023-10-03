import type { DecodingObject, EndpointRequest } from '@moviemasher/runtime-shared'
import type { Application } from 'express'
import type { DecodeStartRequest, StatusRequest, VersionedDataOrError } from '../Api/Api.js'
import type { DecodeServerArgs, ExpressHandler } from './Server.js'

import { assertProbeOptions, idUnique } from '@moviemasher/lib-server'
import { isDecodingObject } from '@moviemasher/lib-shared'
import { EventServerDecode, EventServerDecodeStatus, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, VERSION, VIDEO, errorCaught, errorThrow, isDefiniteError } from '@moviemasher/runtime-shared'
import path from 'path'
import { Endpoints } from '../Api/Endpoints.js'
import { ServerClass } from './ServerClass.js'

export class DecodeServerClass extends ServerClass {
  constructor(public args: DecodeServerArgs) { super(args) }

  id = 'decode'

  decode: ExpressHandler<VersionedDataOrError<EndpointRequest>, DecodeStartRequest> = async (req, res) => {
    const { decodingType = VIDEO, request, options = {}, assetType } = req.body
    try {
      const user = this.userFromRequest(req)
      assertProbeOptions(options)

      const id = idUnique()
      const fragment = path.join(user, id)
      const event = new EventServerDecode(decodingType, assetType, request, fragment, options)
      MovieMasher.eventDispatcher.dispatch(event)
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

  status: ExpressHandler<VersionedDataOrError<EndpointRequest | DecodingObject>, StatusRequest> = async (req, res) => {
    const { id } = req.body
    try {
      const user = this.userFromRequest(req)
      const fragment = path.join(user, id)
      const event = new EventServerDecodeStatus(fragment)
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) errorThrow(ERROR.Unimplemented, EventServerDecodeStatus.Type)

      const orError = await promise

      if (isDefiniteError(orError)) {
        const { error } = orError
        res.send({ version: VERSION, error })
        return
      }
      const { data } = orError
      if (isDecodingObject(data)) {
        res.send({ version: VERSION, data })
        return
      }
      const timeoutAt = data.getTime() + 1000 * 60 * 10 // 10 minutes
      if (Date.now() > timeoutAt) errorThrow(ERROR.Internal, 'timeout')
 
      res.send({ version: VERSION, data: this.statusEndpointRequest(id) })
    } catch (error) { 
      res.send({ version: VERSION, error: errorCaught(error).error })
    }
  }

  private statusEndpointRequest(id: string) {
    const data: EndpointRequest = {
      endpoint: { pathname: Endpoints.decode.status },
      init: { method: 'POST', body: { id } }
    }
    return data
  }
}