// import fs from 'fs/promises'

import { assertEncodeRequest, MediaEvent, MediaResponse, JsonObject, JobType, assertDecodeRequest, assertTranscodeRequest, assertMediaRequest, Input, MediaRequest, assertString, Output, assertPopulatedString, AndId } from "@moviemasher/moviemasher.js"

import { jobExtract, callbackPromise, Transcoder, Decoder, Encoder, outputPromise, inputPromise } from "@moviemasher/server-core"


export const handleRequest = (jobType: JobType, mediaRequest: MediaRequest): Promise<MediaResponse> => {
  
  const { input } = mediaRequest
  
  return inputPromise(input).then(inputResult => {
    if (inputResult.error) return inputResult

    const { path: localPath } = inputResult
    assertString(localPath)
  
    switch(jobType) {
      case JobType.Encoding: {
        assertEncodeRequest(mediaRequest)
        return Encoder.encode(localPath, mediaRequest.output)
      }
      case JobType.Decoding: {
        assertDecodeRequest(mediaRequest)
        return Decoder.decode(localPath, mediaRequest.output)
        
      }
      case JobType.Transcoding: {
        assertTranscodeRequest(mediaRequest)
        return Transcoder.transcode(localPath, mediaRequest.output)
      }
    } 
  })
}

export const handler = async (event: MediaEvent, context: any) => {
  console.log("event", event)
  const bodyJson: JsonObject = JSON.parse(event.body)

  const [jobType, mediaRequest] = jobExtract(bodyJson)
  assertMediaRequest(mediaRequest)
  const { id, callback, output } = mediaRequest
  const endResponse: JsonObject = { id }


  if (callback) {
    const startBody = await callbackPromise(callback, { id, completed: 0.1 })
    if (startBody.error) return startBody
  }

  const mediaResponse = await handleRequest(jobType, mediaRequest)
  if (mediaResponse.error) endResponse.error = mediaResponse.error
  else {
    const { request: outputRequest} = output
    const { path: outputPath } = mediaResponse
    assertPopulatedString(outputPath)
    const uploadResult = await outputPromise(outputPath, outputRequest)
    const { error } = uploadResult
    if (error) endResponse.error = error
  }

  if (callback) return await callbackPromise(callback, { id, completed: 1.0 })
  return endResponse
}
