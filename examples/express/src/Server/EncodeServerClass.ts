import type { EncodingObject, EndpointRequest } from '@moviemasher/runtime-shared'
import type { Application } from 'express'
import type { EncodeStartRequest, StatusRequest, VersionedDataOrError } from '../Api/Api.js'
import type { EncodeServerArgs, ExpressHandler } from './Server.js'

import { idUnique } from '@moviemasher/lib-server'
import { isEncodingObject } from '@moviemasher/lib-shared'
import { EventServerEncode, EventServerEncodeStatus, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, MASH, VERSION, VIDEO, errorCaught, errorThrow, isAssetObject, isDefiniteError } from '@moviemasher/runtime-shared'
import path from 'path'
import { Endpoints } from '../Api/Endpoints.js'
import { ServerClass } from './ServerClass.js'

export class EncodeServerClass extends ServerClass {
  constructor(public args: EncodeServerArgs) { super(args) }

  id = 'encode'

  encode: ExpressHandler<VersionedDataOrError<EndpointRequest>, EncodeStartRequest> = async (req, res) => {
    const { encodingType = VIDEO, mashAssetObject, options = {} } = req.body
    try {
      const user = this.userFromRequest(req)
      if (!isAssetObject(mashAssetObject, encodingType, MASH)) {
        errorThrow(ERROR.Syntax, `invalid ${encodingType} mash`)
      }
      const encodingId = idUnique()
      const fragment = path.join(user, encodingId)
      const event = new EventServerEncode(encodingType, mashAssetObject, options, fragment)
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
      app.post(Endpoints.encode.start, this.encode)
      app.post(Endpoints.encode.status, this.status)
    })
  }

  status: ExpressHandler<VersionedDataOrError<EndpointRequest | EncodingObject>, StatusRequest> = async (req, res) => {
    const { id } = req.body
    try {
      const user = this.userFromRequest(req)
      const fragment = path.join(user, id)
      const event = new EventServerEncodeStatus(fragment)
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) errorThrow(ERROR.Unimplemented, EventServerEncodeStatus.Type)

      const orError = await promise

      if (isDefiniteError(orError)) {
        const { error } = orError
        res.send({ version: VERSION, error })
        return
      }
      const { data } = orError
      if (isEncodingObject(data)) {
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
      endpoint: { pathname: Endpoints.encode.status },
      init: { method: 'POST', body: { id } }
    }
    return data
  }
}