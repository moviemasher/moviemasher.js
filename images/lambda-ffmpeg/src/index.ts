
import { 
  JsonRecord, StringDataOrError, 
  assertPopulatedString, Identified, isDefiniteError,
} from "@moviemasher/lib-core"

import { 
  JobType,
  assertEncodeRequest, MediaEvent, MediaRequest, 
  assertDecodeRequest, assertTranscodeRequest, assertMediaRequest, 
  jobExtract, callbackPromise, transcode, decode, encode, outputPromise, 
  inputPromise 
} from "@moviemasher/server-core"
import { JobTypeEncoding, JobTypeDecoding, JobTypeTranscoding } from "@moviemasher/server-core/src/Setup/Enums"


export const handleRequest = (jobType: JobType, mediaRequest: MediaRequest): Promise<StringDataOrError> => {
  
  const { input } = mediaRequest
  
  return inputPromise(input).then(inputResult => {
    if (isDefiniteError(inputResult)) return inputResult

    const { path: localPath } = inputResult
  
    switch(jobType) {
      case JobTypeEncoding: {
        assertEncodeRequest(mediaRequest)
        return encode(localPath, mediaRequest.output)
      }
      case JobTypeDecoding: {
        
        assertDecodeRequest(mediaRequest)
        return decode(localPath, mediaRequest.output)
      }
      case JobTypeTranscoding: {
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
  const endResponse: Identified = { id }

  if (callback) {
    const startBody = await callbackPromise(callback, { id, completed: 0.1 })
    if (startBody.error) return startBody
  }

  const mediaResponse = await handleRequest(jobType, mediaRequest)
  if (isDefiniteError(mediaResponse)) return mediaResponse


  const { request: outputRequest} = output
  if (outputRequest) {
    const { path: outputPath } = mediaResponse
    assertPopulatedString(outputPath)
    
    const uploadResult = await outputPromise(outputPath, outputRequest)
    if (isDefiniteError(uploadResult)) return uploadResult
  }


  if (callback) return await callbackPromise(callback, { id, completed: 1.0 })
  return endResponse
}
