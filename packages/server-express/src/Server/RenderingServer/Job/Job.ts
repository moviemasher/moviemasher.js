import { ApiCallback, RenderingOptions } from "@moviemasher/moviemasher.js"

export interface JobInput extends RenderingOptions {
  cacheDirectory: string
  renderingDirectory: string
  fileDirectory: string
}

export interface JobIdCallback {
  callback?: ApiCallback
  id?: string
}

export interface JobOptions extends JobInput, JobIdCallback {}

export interface JobArgs extends Required<JobInput>, JobIdCallback {}

export interface Job {
  renderPromise: ()=> Promise<void>
}
