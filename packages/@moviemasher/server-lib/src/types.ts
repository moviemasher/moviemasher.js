import type { AVType, AbsolutePath, Asset, AssetObject, RawType, AudibleInstance, AudioInstance, CacheArgs, CacheOptions, ContainerInstance, ContentInstance, DataOrError, DropType, AssetFileType, Importer, Instance, MashDescription, MashDescriptionArgs, MashDescriptionOptions, Mimetype, MovieMasherOptions, MovieMasherRuntime, OutputOptions, Propertied, RectTuple, SegmentDescription, SegmentDescriptionArgs, Size, Time, TimeRange, ValueRecord, VisibleContentInstance, VisibleInstance, AudioType, VideoType, VideoOutputOptions, Times } from '@moviemasher/shared-lib/types.js'
import type { ServerAudibleAsset, ServerAudioAsset, ServerVisibleAsset } from './type/ServerAssetTypes.js'
import type { ServerClip, ServerMashAsset } from './type/ServerMashTypes.js'


export interface ServerImporter extends Importer {
  icon: Node
}

export interface AssetFile {
  avType?: AudioType | VideoType
  type: AssetFileType
  file: string
  content?: string 
  asset: ServerAsset
}

export interface AssetFiles extends Array<AssetFile>{}

export interface CommandFile extends AssetFile {
  path?: string
  inputOptions?: ValueRecord
  outputOptions?: ValueRecord
  inputId: string
}

export interface ServerPromiseArgs extends CacheOptions { 
  commandFiles: CommandFiles
}

export interface FilterArgs {
  propertied?: Propertied
}

export interface CommandFiles extends Array<CommandFile>{}

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

export interface CommandFileOptions {
  time: Time
}

export interface AudioCommandFileOptions extends CommandFileOptions {
  audioRate?: number
}

export interface AudioCommandFileArgs extends AudioCommandFileOptions {
  audioRate: number
  clipTime: TimeRange
}

export interface VideoCommandFileOptions extends CommandFileOptions {
  encodePath: AbsolutePath
  outputSize: Size
  videoRate: number
}

export interface VisibleCommandFileArgs extends VideoCommandFileOptions {
  // outputSize: Size
  // videoRate: number
  clipTime: TimeRange  
  // videoRate: number
  containerRects: RectTuple
}

export interface CommandFileArgs extends CommandFileOptions, CacheArgs {
  
  clipTime: TimeRange
}


export interface CommandFilterArgs  {
  track: number
  commandFiles: CommandFiles
  chainInput: string
  filterInput?: string
  duration: number
  clipTime: TimeRange
}

export interface VideoCommandFilterOptions extends CommandFilterArgs, VideoCommandFileOptions {
  clipTime: TimeRange
}

export interface AudioCommandFilterOptions extends CommandFilterArgs, AudioCommandFileOptions {
  clipTime: TimeRange
}

export interface AudibleCommandFilterArgs extends AudioCommandFilterOptions {}

export interface VideoCommandFilterArgs extends VideoCommandFilterOptions {
  outputSize: Size
}

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
  clip: ServerClip
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
  mash: ServerMashAsset
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
  clip?: ServerClip
  mashDescription: ServerMashDescription
}

export interface ServerAssetManager {
  asset(object: string | AssetObject): ServerAsset | undefined
}


export interface ServerAudibleInstance extends ServerInstance, AudibleInstance {
  asset: ServerAudibleAsset
  audibleCommandFiles(args: AudioCommandFileArgs): CommandFiles
  // audibleCommandFilters(args: AudibleCommandFilterArgs): CommandFilters
}

export interface ServerVisibleInstance extends ServerInstance, VisibleInstance {
  asset: ServerVisibleAsset
  visibleCommandFiles(args: VisibleCommandFileArgs, content?: VisibleContentInstance): CommandFiles
}

export interface ServerAudioInstance extends ServerInstance, AudioInstance {
  asset: ServerAudioAsset
}

export interface ServerContentInstance extends ServerVisibleInstance, ContentInstance {
  asset: ServerVisibleAsset
}

export interface ServerContainerInstance extends ServerVisibleInstance, ContainerInstance {
  asset: ServerVisibleAsset
}

export interface ServerInstance extends Instance {
  asset: ServerAsset
  commandFiles(args: CommandFileArgs): CommandFiles
}

export interface ServerAsset extends Asset {
  assetManager: ServerAssetManager

  /** All files needed for audible and/or visible encode commands. */
  assetFiles(args: CacheArgs): AssetFiles

  /** Writes a command file, if it's not a raw asset. */
  commandFilePromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>>
}

export interface ServerAssets extends Array<ServerAsset>{}
