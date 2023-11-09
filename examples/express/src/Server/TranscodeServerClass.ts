import type { Transcoding, EndpointRequest } from '@moviemasher/runtime-shared'
import type { Application } from 'express'
import type { TranscodeStartRequest, StatusRequest, VersionedDataOrError } from '../Api/Api.js'
import type { TranscodeServerArgs, ExpressHandler } from './Server.js'

import { ENV, ENVIRONMENT, assertProbeOptions, idUnique } from '@moviemasher/lib-server'
import { ContentTypeHeader, JsonMimetype, assertPopulatedString, isTranscoding } from '@moviemasher/lib-shared'
import { EventServerTranscode, EventServerTranscodeStatus, MovieMasher } from '@moviemasher/runtime-server'
import { ERROR, VERSION, VIDEO, errorCaught, errorObjectCaught, errorThrow, isDefiniteError, isPopulatedString } from '@moviemasher/runtime-shared'
import path from 'path'
import { Endpoints } from '../Api/Endpoints.js'
import { ServerClass } from './ServerClass.js'

export class TranscodeServerClass extends ServerClass {
  constructor(public args: TranscodeServerArgs) { super(args) }

  id = 'transcode'

  start: ExpressHandler<VersionedDataOrError<EndpointRequest>, TranscodeStartRequest> = async (req, res) => {
    console.error(this.constructor.name, 'start', req.body)
    const { transcodingType = VIDEO, request, options = {}, assetType } = req.body

    try {
      const user = this.userFromRequest(req)
      assertProbeOptions(options)

      const id = idUnique()
      const { endpoint } = request
      assertPopulatedString(endpoint)

      const exampleRoot = ENVIRONMENT.get(ENV.ExampleRoot)
      request.endpoint = path.join(exampleRoot, endpoint)
      const event = new EventServerTranscode(transcodingType, assetType, request, user, id, options, exampleRoot)
      MovieMasher.eventDispatcher.dispatch(event)
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
      MovieMasher.eventDispatcher.dispatch(event)
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
      init: { method: 'POST', headers: { [ContentTypeHeader]: JsonMimetype}, body: JSON.stringify({ id }) }
    }
    return data
  }
}