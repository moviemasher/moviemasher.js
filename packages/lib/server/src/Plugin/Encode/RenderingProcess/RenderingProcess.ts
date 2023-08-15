import type { RenderingOptions } from '@moviemasher/lib-shared'
import type { StringDataOrError } from '@moviemasher/runtime-shared'

export interface ServerEncodeOptions {
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
export interface RenderingProcessArgs extends ServerEncodeOptions, RenderingOptions {
  id?: string
}

export interface RenderingProcess {
  runPromise: ()=> Promise<StringDataOrError>
}
