import { ApiCallback, RenderingOptions } from "@moviemasher/moviemasher.js"
import { RenderingResult } from "../Encode"
export interface RenderingProcessInput {
  cacheDirectory: string
  /** directory to place output file(s) within */
  outputDirectory: string
  /** directory where file server creates user directories */
  filePrefix: string
  /** user directory name */
  defaultDirectory: string
  /** other allowed user directories relative to default - eg. shared */
  validDirectories: string[]
}

export interface RenderingCallback {
  callback?: ApiCallback
  id?: string
}

export interface RunResult {
  results: RenderingResult[]
}

export interface RenderingProcessOptions extends RenderingProcessInput, Partial<RenderingOptions>, RenderingCallback {}

export interface RenderingArgs extends Required<RenderingOptions> {}

export interface RenderingProcessArgs extends RenderingProcessInput, RenderingArgs {
  id?: string
  temporaryDirectory: string
}

export interface RenderingProcess {
  runPromise: ()=> Promise<RunResult>
}
