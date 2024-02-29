import type { EndpointRequest, JobOptions, Transcoding } from '@moviemasher/shared-lib/types.js'
import type { Application } from 'express'
import type { StatusRequest, TranscodeStartRequest, VersionedDataOrError } from '../Api/Api.js'
import type { ExpressHandler, TranscodeServerArgs } from './Server.js'

import { ENV, ENV_KEY } from '@moviemasher/server-lib/utility/env.js'
import { EventServerTranscodeStatus } from '@moviemasher/server-lib/utility/events.js'
import { idUnique } from '@moviemasher/server-lib/utility/id.js'
import { $POST, $TRANSCODE, CONTENT_TYPE, ERROR, MIME_JSON, MOVIE_MASHER, VERSION, errorCaught, errorObjectCaught, errorThrow, isDefiniteError, jsonStringify } from '@moviemasher/shared-lib/runtime.js'
import { assertPopulatedString, isTranscoding } from '@moviemasher/shared-lib/utility/guards.js'
import path from 'path'
import { Endpoints } from '../Api/Endpoints.js'
import { ServerClass } from './ServerClass.js'

export class TranscodeServerClass extends ServerClass {
  constructor(public args: TranscodeServerArgs) { super(args) }

  id = 'transcode'

  start: ExpressHandler<VersionedDataOrError<EndpointRequest>, TranscodeStartRequest> = async (req, res) => {
    const { body: args } = req
    const { version: _, ...transcodeArgs } = args
    const { request } = transcodeArgs.resource
    try {
      const user = this.userFromRequest(req)
      const id = idUnique()
      const { endpoint } = request
      assertPopulatedString(endpoint)

      const outputRoot = ENV.get(ENV_KEY.RelativeRequestRoot)
      request.endpoint = path.join(outputRoot, endpoint)

      const jobOptions: JobOptions = { id, user }
      const promise = MOVIE_MASHER.promise(transcodeArgs, $TRANSCODE, jobOptions)
      res.send({ version : VERSION, data: this.statusEndpointRequest(id) })
    } catch (error) { 
      console.error(this.constructor.name, 'start', error)
      res.send({ version: VERSION, error: errorCaught(error).error })
    }
  }

  startServer(app: Application): Promise<void> {
    return super.startServer(app).then(() => {
      app.post(Endpoints.transcode.start, this.start)
      app.post(Endpoints.transcode.status, this.status)
    })
  }

  status: ExpressHandler<VersionedDataOrError<EndpointRequest | Transcoding>, StatusRequest> = async (req, res) => {
    const { id } = req.body
    try {
      const user = this.userFromRequest(req)
      const event = new EventServerTranscodeStatus(id)
      MOVIE_MASHER.dispatch(event)
      const { promise } = event.detail
      if (!promise) errorThrow(ERROR.Unimplemented, EventServerTranscodeStatus.Type)

      const orError = await promise
      if (isDefiniteError(orError)) {
        const { error } = orError
        res.send({ version: VERSION, error })
        return
      }
      const { data } = orError
      if (isTranscoding(data)) {
        res.send({ version: VERSION, data })
        return
      }
      const timeoutAt = data.getTime() + 1000 * 60 * 10 // 10 minutes
      if (Date.now() > timeoutAt) errorThrow(ERROR.Internal, 'timeout')
      
      const sendData = this.statusEndpointRequest(id)
      console.log('TranscodeServerClass.status', { sendData })
      res.send({ version: VERSION, data: sendData })
    } catch (error) { 
      console.error(this.constructor.name, 'status', error)
      res.send({ version: VERSION, error: errorObjectCaught(error) })
    }
  }

  private statusEndpointRequest(id: string) {
    const data: EndpointRequest = {
      endpoint: { pathname: Endpoints.transcode.status },
      init: { 
        method: $POST, headers: { [CONTENT_TYPE]: MIME_JSON}, 
        body: jsonStringify({ id }) 
      }
    }
    return data
  }
}