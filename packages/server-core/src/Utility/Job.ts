import { 
  JsonRecord, assertObject, isArray, requestPromise, 
  Request, PotentialError, PathDataOrError, Requests, Identified
} from "@moviemasher/moviemasher.js";
import { Input } from "../declarations";
import { assertJobType, JobType } from "../Setup/Enums";
import { Environment, environment } from "../Environment/Environment";

export type JobTuple = [JobType, JsonRecord]



export interface CallbackRequestBody extends Identified, PotentialError {
  completed: number
}

export const jobExtract = (object: JsonRecord): JobTuple => {
  const typeKeypath = environment(Environment.API_KEYPATH_TYPE)
  const jobKeypath = environment(Environment.API_KEYPATH_JOB) 
  const { [typeKeypath]: jobType, [jobKeypath]: jobOrJobs } = object
  const job = isArray(jobOrJobs) ? jobOrJobs[0] : jobOrJobs
  
  assertObject(job, jobKeypath)
  assertJobType(jobType, typeKeypath)

  return [jobType, job as JsonRecord]
}

export const outputPromise = (localPath: string, request: Request): Promise<PotentialError> => (
  
  
  requestPromise(request).then(() => { return {} })
)

export const inputPromise = (input: Input): Promise<PathDataOrError> => {
  const { request } = input
  
  const promise: Promise<PathDataOrError> = request ? requestPromise(request) : Promise.resolve({ path: '' })
  return promise
}

export const callbackPromise = (request: Request | Requests, body: CallbackRequestBody): Promise<PotentialError> => {
  const requests = isArray(request) ? request : [request]
  const promises = requests.map(request => {
    request.init ||= {}
    request.init.body = body
    return requestPromise(request)
  })
  return Promise.all(promises).then(() => ({}))
}
