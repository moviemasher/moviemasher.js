import type { Encoding, EndpointRequest, JobOptions } from '@moviemasher/shared-lib/types.js'
import type { Application } from 'express'
import type { EncodeStartRequest, StatusRequest, VersionedDataOrError } from '../Api/Api.js'
import type { EncodeServerArgs, ExpressHandler } from './Server.js'

import { EventServerEncodeStatus } from '@moviemasher/server-lib/utility/events.js'
import { idUnique } from '@moviemasher/server-lib/utility/id.js'
import { $ENCODE, $MASH, $POST, CONTENT_TYPE, ERROR, MIME_JSON, MOVIEMASHER, VERSION, errorCaught, errorObjectCaught, errorThrow, isAssetObject, isDefiniteError, jsonStringify } from '@moviemasher/shared-lib/runtime.js'
import { isEncoding } from '@moviemasher/shared-lib/utility/guards.js'
import { Endpoints } from '../Api/Endpoints.js'
import { ServerClass } from './ServerClass.js'

export class EncodeServerClass extends ServerClass {
  constructor(public args: EncodeServerArgs) { super(args) }

  id = 'encode'

  start: ExpressHandler<VersionedDataOrError<EndpointRequest>, EncodeStartRequest> = async (req, res) => {
    const { body: args } = req
    const { version: _, ...encodeArgs } = args
    try {
      const user = this.userFromRequest(req)
      const { type, asset } = encodeArgs
      if (!isAssetObject(asset, type, $MASH)) {
        console.log(this.constructor.name, 'start', req)
        errorThrow(ERROR.Syntax, asset)
      }
      const id = idUnique()
      const jobOptions: JobOptions = { id, user }
      const promise = MOVIEMASHER.promise($ENCODE, encodeArgs, jobOptions)
      res.send({ version: VERSION, data: this.statusEndpointRequest(id) })
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
      MOVIEMASHER.dispatch(event)
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
        method: $POST, 
        headers: { [CONTENT_TYPE]: MIME_JSON}, 
        body: jsonStringify({ id }) }
    }
    return data
  }
}