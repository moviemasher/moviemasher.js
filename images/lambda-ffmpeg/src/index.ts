
import { 
  JsonRecord, 
  assertString, assertPopulatedString
} from "@moviemasher/moviemasher.js"

import { 
  JobType,
  assertEncodeRequest, MediaEvent, MediaResponse, MediaRequest, 
  assertDecodeRequest, assertTranscodeRequest, assertMediaRequest, 
  jobExtract, callbackPromise, transcode, decode, encode, outputPromise, 
  inputPromise 
} from "@moviemasher/server-core"


export const handleRequest = (jobType: JobType, mediaRequest: MediaRequest): Promise<MediaResponse> => {
  
  const { input } = mediaRequest
  
  return inputPromise(input).then(inputResult => {
    if (inputResult.error) return inputResult

    const { path: localPath } = inputResult
    assertString(localPath)
  
    switch(jobType) {
      case JobType.Encoding: {
        assertEncodeRequest(mediaRequest)
        return encode(localPath, mediaRequest.output)
      }
      case JobType.Decoding: {
        assertDecodeRequest(mediaRequest)
        return decode(localPath, mediaRequest.output)
        
      }
      case JobType.Transcoding: {
        assertTranscodeRequest(mediaRequest)
        return transcode(localPath, mediaRequest.output)
      }
    } 
  })
}

export const handler = async (event: MediaEvent, context: any) => {
  console.log("event", event)
  const bodyJson: JsonRecord = JSON.parse(event.body)

  const [jobType, mediaRequest] = jobExtract(bodyJson)
  assertMediaRequest(mediaRequest)
  const { id, callback, output } = mediaRequest
  const endResponse: JsonRecord = { id }

  if (callback) {
    const startBody = await callbackPromise(callback, { id, completed: 0.1 })
    if (startBody.error) return startBody
  }

  const mediaResponse = await handleRequest(jobType, mediaRequest)
  if (mediaResponse.error) endResponse.error = mediaResponse.error
  else {
    const { request: outputRequest} = output
    if (outputRequest) {
      const { path: outputPath } = mediaResponse
      assertPopulatedString(outputPath)
      
      const uploadResult = await outputPromise(outputPath, outputRequest)
      const { error } = uploadResult
      if (error) endResponse.error = error  
    }
  }

  if (callback) return await callbackPromise(callback, { id, completed: 1.0 })
  return endResponse
}
