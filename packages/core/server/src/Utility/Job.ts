import { 
  JsonRecord, assertObject, isArray, 
  EndpointRequest, PotentialError, StringDataOrError, EndpointRequests, Identified, Runtime
} from "@moviemasher/lib-core"
import { Input } from "../Types/Core"
import { assertJobType, JobType } from "../Setup/Enums"
import { EnvironmentKeyApiKeypathJob, EnvironmentKeyApiKeypathType } from "../Environment/ServerEnvironment"

export type JobTuple = [JobType, JsonRecord]



export interface CallbackRequestBody extends Identified, PotentialError {
  completed: number
}

export const jobExtract = (object: JsonRecord): JobTuple => {

  const { environment } = Runtime
  const typeKeypath = environment.get(EnvironmentKeyApiKeypathType)
        
  const jobKeypath = environment.get(EnvironmentKeyApiKeypathJob)
        
  const { [typeKeypath]: jobType, [jobKeypath]: jobOrJobs } = object
  const job = isArray(jobOrJobs) ? jobOrJobs[0] : jobOrJobs
  
  assertObject(job, jobKeypath)
  assertJobType(jobType, typeKeypath)

  return [jobType, job as JsonRecord]
}

export const outputPromise = (localPath: string, request: EndpointRequest): Promise<PotentialError> => {
  throw new Error('outputPromise not implemented')
}
  
  
  //requestPromise(request).then(() => { return {} })


export const inputPromise = (input: Input): Promise<StringDataOrError> => {
  const { request } = input
  throw new Error('inputPromise not implemented')

  // const promise: Promise<StringDataOrError> = request ? requestPromise(request) : Promise.resolve({ path: '' })
  // return promise
}

export const callbackPromise = (request: EndpointRequest | EndpointRequests, body: CallbackRequestBody): Promise<PotentialError> => {
  throw new Error('callbackPromise not implemented')
  // const requests = isArray(request) ? request : [request]
  // const promises = requests.map(request => {
  //   request.init ||= {}
  //   request.init.body = body
  //   return requestPromise(request)
  // })
  // return Promise.all(promises).then(() => ({}))
}
