
import {
  DefinitionObjects, MashObject, StreamingCommandOutput
} from '@moviemasher/moviemasher.js'

import { RunningCommand } from '../../../RunningCommand/RunningCommand'

export interface StreamConnectionCommand {
  command: RunningCommand
  destination: string
}

export interface StreamingProcessArgs {
  id: string,
  directory: string
  file: string
  commandOutput: StreamingCommandOutput
  cacheDirectory: string
  temporaryDirectory: string
  filePrefix: string
  defaultDirectory: string
  validDirectories: string[]
}

export interface StreamingProcessCutArgs {
  mashObjects: MashObject[]
  definitionObjects: DefinitionObjects
}
