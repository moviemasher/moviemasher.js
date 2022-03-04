import { ApiCallback, RenderingOptions, RenderingResult } from "@moviemasher/moviemasher.js"

export interface RenderingProcessInput extends RenderingOptions {
  cacheDirectory: string
  renderingDirectory: string
  fileDirectory: string
}

export interface RenderingCallback {
  callback?: ApiCallback
  id?: string
}

export interface RunResult {
  results: RenderingResult[]
}

export interface RenderingProcessOptions extends RenderingProcessInput, RenderingCallback {}

export interface RenderingProcessArgs extends Required<RenderingProcessInput>, RenderingCallback {}

export interface RenderingProcess {
  runPromise: ()=> Promise<RunResult>
}
