import type { CommandFilters, CommandInputs } from '@moviemasher/runtime-server'
import type { AVType, AssetType, DataOrError, EncodingType, OutputOptions, Time } from '@moviemasher/runtime-shared'
import type { ServerMashAsset } from '../Types/ServerMashTypes.js'

export interface CommandOptions extends CommandDescription {
  output: OutputOptions
}

export interface CommandDescription {
  duration?: number
  inputs?: CommandInputs
  commandFilters?: CommandFilters
  avType: AVType
}

export interface CommandDescriptions extends Array<CommandDescription>{}

export interface MashDescription {
  audibleCommandDescription?: CommandDescription
  visibleCommandDescriptions?: CommandDescriptions
  outputOptions: OutputOptions
  encodingType: AssetType
}

export interface MashDescriberOptions {
  outputOptions: OutputOptions
  encodingType: EncodingType
  mash: ServerMashAsset
  startTime?: Time
  endTime?: Time
}

export interface MashDescriber {
  mashDescriptionPromise(): Promise<DataOrError<MashDescription>>
}
