import type { AVType, AbsolutePath, AssetObject, RawType, AudioInstance, ContainerInstance, DataOrError, DropType, Importer, MashDescription, MashDescriptionArgs, MashDescriptionOptions, Mimetype, MovieMasherOptions, MovieMasherRuntime, OutputOptions, Propertied, RectTuple, SegmentDescription, SegmentDescriptionArgs, Time, TimeRange, ValueRecord, VideoOutputOptions, Times, MashAsset, Clip, AudioAsset, ContainerAsset, ServerAsset, CommandFiles, ServerInstance, AudioCommandFileOptions, VideoCommandFileOptions, ServerVisibleInstance, ServerAudibleInstance } from '@moviemasher/shared-lib/types.js'
import type { ServerMashAsset } from './type/ServerMashTypes.js'

export interface ServerImporter extends Importer {
  icon: Node
}

export interface FilterArgs {
  propertied?: Propertied
}

export interface CommandInput {
  avType: AVType
  source: string
  inputOptions?: ValueRecord
  outputOptions?: ValueRecord
}

export interface CommandInputs extends Array<CommandInput>{}

export interface CommandFilter {
  ffmpegFilter: string
  inputs: string[]
  outputs: string[]
  options: ValueRecord
}

export interface CommandFilters extends Array<CommandFilter>{}

export interface CommandFilterArgs  {
  track: number
  commandFiles: CommandFiles
  chainInput: string
  filterInput?: string
  duration: number
  clipTime: TimeRange
}

export interface AudibleCommandFilterArgs extends CommandFilterArgs, AudioCommandFileOptions {}

export interface VideoCommandFilterArgs extends CommandFilterArgs, VideoCommandFileOptions {}

export interface VisibleCommandFilterArgs extends VideoCommandFilterArgs {
  containerRects: RectTuple
}

export interface MovieMasherServerOptions extends MovieMasherOptions {}

export interface MovieMasherServerRuntime extends MovieMasherRuntime {
  options: MovieMasherServerOptions
}

export interface PathAndType {
  path: AbsolutePath
  type: Mimetype | DropType
}

export interface CommandOptions extends EncodeDescription {
  output: OutputOptions
}

export interface CommandInputRecord extends Record<string, CommandInput> { }

export interface PrecodeDescription {
  duration: number
  inputsById: CommandInputRecord
  commandFilters: CommandFilters
  clip: Clip
}
export interface PrecodeDescriptions extends Array<PrecodeDescription> {}

export interface EncodeDescription extends Partial<Omit<PrecodeDescription, "clip">> {
  avType: AVType
}

export interface EncodeDescriptions extends Array<EncodeDescription> {}

export interface PrecodeCommands {
  commandDescriptions: PrecodeDescriptions
  outputOptions: VideoOutputOptions
  times: Times
}

export interface EncodeCommands {
  audibleDescriptions?: EncodeDescriptions
  visibleDescriptions?: EncodeDescriptions
  outputOptions: OutputOptions
  encodingType: RawType
}

export interface ServerMashDescription extends MashDescription {
  needsPrecoding: boolean
  encodePath: AbsolutePath
  duration: number
  mash: MashAsset
  audioRate: number
  background: string
  videoRate: number
  intrinsicsPromise: Promise<DataOrError<number>>
  encodeCommandsPromise(): Promise<DataOrError<EncodeCommands>>
  precodeCommandsPromise(): Promise<DataOrError<PrecodeCommands>>
}

export interface ServerMashDescriptionOptions extends MashDescriptionOptions { 
  encodePath: AbsolutePath
  outputOptions?: OutputOptions
  mute?: boolean
  audioRate?: number
  videoRate?: number
  background?: string
}

export interface ServerMashDescriptionArgs extends MashDescriptionArgs, ServerMashDescriptionOptions {
  encodePath: AbsolutePath
  mash: ServerMashAsset
}

export interface ServerSegmentDescription extends SegmentDescription {
  time: Time
  avType: AVType
  audible: boolean
  visible: boolean
  encodeDescription: EncodeDescription
  precodeDescription: PrecodeDescription
  assetsServerPromise: Promise<DataOrError<number>>
  filters: CommandFilters
  inputs: CommandInputRecord
  duration: number
}

export interface ServerSegmentDescriptionArgs extends SegmentDescriptionArgs {
  time: Time
  clip?: Clip
  mashDescription: ServerMashDescription
}

export interface ServerAssetManager {
  asset(object: string | AssetObject): ServerAsset | undefined
}

export interface ServerAudioInstance extends ServerInstance, AudioInstance {
  asset: ServerAsset & AudioAsset 
}

export type ServerContentInstance = ServerVisibleInstance | ServerAudibleInstance

export interface ServerContainerInstance extends ServerVisibleInstance, ContainerInstance {
  asset: ServerAsset & ContainerAsset 
}

export interface Tweening {
  point?: boolean
  size?: boolean
  color?: boolean
  canColor?: boolean
}
