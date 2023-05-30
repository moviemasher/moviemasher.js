import type { RenderingOptions, StringDataOrError } from "@moviemasher/lib-core"


export interface RenderingProcessArgs extends RenderingOptions {
  id?: string
  temporaryDirectory: string
  
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

export interface RenderingProcess {
  runPromise: ()=> Promise<StringDataOrError>
}
