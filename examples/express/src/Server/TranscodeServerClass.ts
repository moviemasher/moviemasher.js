import type { EndpointRequest, Transcoding } from '@moviemasher/runtime-shared'
import type { Application } from 'express'
import type { StatusRequest, TranscodeStartRequest, VersionedDataOrError } from '../Api/Api.js'
import type { ExpressHandler, TranscodeServerArgs } from './Server.js'

import { ENV_KEY, ENV, assertProbingOptions } from '@moviemasher/lib-server'
import { assertPopulatedString, isTranscoding } from '@moviemasher/lib-shared'
import { EventServerTranscode, EventServerTranscodeStatus, MOVIEMASHER_SERVER } from '@moviemasher/runtime-server'
import { CONTENT_TYPE, ERROR, MIME_JSON, POST, VERSION, VIDEO, errorCaught, errorObjectCaught, errorThrow, isDefiniteError, jsonStringify } from '@moviemasher/runtime-shared'
import path from 'path'
import { Endpoints } from '../Api/Endpoints.js'
import { ServerClass } from './ServerClass.js'
import { idUnique } from '../Hash.js'

export class TranscodeServerClass extends ServerClass {
  constructor(public args: TranscodeServerArgs) { super(args) }

  id = 'transcode'

  start: ExpressHandler<VersionedDataOrError<EndpointRequest>, TranscodeStartRequest> = async (req, res) => {
    console.error(this.constructor.name, 'start', req.body)
    const { transcodingType = VIDEO, request, options = {}, assetType } = req.body

    try {
      const user = this.userFromRequest(req)
      assertProbingOptions(options)

      const id = idUnique()
      const { endpoint } = request
      assertPopulatedString(endpoint)

      const exampleRoot = ENV.get(ENV_KEY.ExampleRoot)
      request.endpoint = path.join(exampleRoot, endpoint)
      const event = new EventServerTranscode(transcodingType, assetType, request, user, id, options, exampleRoot)
      MOVIEMASHER_SERVER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) errorThrow(ERROR.Unimplemented, EventServerTranscode.Type)
    
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
      console.log('TranscodeServerClass.status', { id, user })
      const event = new EventServerTranscodeStatus(id)
      MOVIEMASHER_SERVER.eventDispatcher.dispatch(event)
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
        method: POST, headers: { [CONTENT_TYPE]: MIME_JSON}, 
        body: jsonStringify({ id }) 
      }
    }
    return data
  }
}