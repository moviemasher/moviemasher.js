import { 
  JsonObject, assertObject, isArray, requestPromise, 
  RequestObject, PotentialError, PathOrError, RequestObjects
} from "@moviemasher/moviemasher.js";
import { Input } from "../declarations";
import { assertJobType, JobType } from "../Setup/Enums";
import { Environment, environment } from "./Environment";

export type JobTuple = [JobType, JsonObject]



export interface CallbackRequestBody extends PotentialError {
  id: string
  completed: number
}

export const jobExtract = (object: JsonObject): JobTuple => {
  const typeKeypath = environment(Environment.API_KEYPATH_TYPE)
  const jobKeypath = environment(Environment.API_KEYPATH_JOB) 
  const { [typeKeypath]: jobType, [jobKeypath]: jobOrJobs } = object
  const job = isArray(jobOrJobs) ? jobOrJobs[0] : jobOrJobs
  
  assertObject(job, jobKeypath)
  assertJobType(jobType, typeKeypath)

  return [jobType, job]
}

export const outputPromise = (localPath: string, request: RequestObject): Promise<PotentialError> => (
  
  
  requestPromise(request).then(() => { return {} })
)

export const inputPromise = (input: Input): Promise<PathOrError> => {
  const response: PathOrError = {}

  const { request } = input
  
  const promise: Promise<PathOrError> = request ? requestPromise(request) : Promise.resolve({ path: '' })
  return promise.then(path => {
    if (path) {

    }
    return response
  })
}

export const callbackPromise = (request: RequestObject | RequestObjects, body: CallbackRequestBody): Promise<PotentialError> => {
  const requests = isArray(request) ? request : [request]
  const promises = requests.map(request => {
    request.init ||= {}
    request.init.body = body
    return requestPromise(request)
  })
  return Promise.all(promises).then(() => { return {} })
}
