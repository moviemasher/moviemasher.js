import type { AVType, AbsolutePath, Asset, AssetObject, AssetType, AudibleInstance, AudioInstance, CacheArgs, CacheOptions, ContainerInstance, ContentInstance, DataOrError, DecodeOptions, Decoding, DecodingType, DropType, EncodeOptions, Encoding, EncodingType, EndpointRequest, AssetFileType, Importer, Instance, IntrinsicOptions, MashAssetObject, MashDescription, MashDescriptionArgs, MashDescriptionOptions, Mimetype, MovieMasherOptions, MovieMasherRuntime, OutputOptions, Propertied, Rect, RectTuple, SegmentDescription, SegmentDescriptionArgs, ServerMediaRequest, Size, StringDataOrError, Strings, Time, TimeRange, TranscodeOptions, Transcoding, TranscodingType, Value, ValueRecord, VisibleContentInstance, VisibleInstance, AudioType, VideoType, VideoOutputOptions, Times } from '@moviemasher/shared-lib/types.js'
import type { ServerAudibleAsset, ServerAudioAsset, ServerVisibleAsset } from './type/ServerAssetTypes.js'
import type { ServerClip, ServerMashAsset } from './type/ServerMashTypes.js'
import type { Tweening } from './type/ServerTypes.js'


export interface ServerImporter extends Importer {
  icon: Node
}

export interface ServerAsset extends Asset {
  fontDirectory: string
  /** All files needed for audible and/or visible encode commands. */
  assetFiles(args: CacheArgs): AssetFiles

  /** Writes a command file, if it's not a raw asset. */
  commandFilePromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>>
}

export interface ServerAssets extends Array<ServerAsset>{}

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


export interface CommandFilterOptions  {
  track: number
  commandFiles: CommandFiles
  chainInput: string
  filterInput?: string
  duration: number
  clipTime: TimeRange
}


export interface CommandFilterArgs extends CommandFilterOptions {
  track: number
  commandFiles: CommandFiles
  chainInput: string
  filterInput?: string
  duration: number

}

export interface VideoCommandFilterOptions extends CommandFilterOptions, VideoCommandFileOptions {
  clipTime: TimeRange
}

export interface AudioCommandFilterOptions extends CommandFilterOptions, AudioCommandFileOptions {
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

export interface EventServerMediaPromiseDetail {
  dropType: DropType
  request: ServerMediaRequest
  validDirectories?: Strings
  promise?: Promise<DataOrError<PathAndType>>
}

export interface EventServerManagedAssetDetail {
  assetId: string
  assetObject?: AssetObject
  asset?: ServerAsset
}

export interface EventServerDecodeDetail {
  assetType: AssetType
  user: string
  id: string
  request: ServerMediaRequest
  decodingType: DecodingType
  decodeOptions: DecodeOptions
  promise?: Promise<StringDataOrError>
}

export interface EventServerDecodeStatusDetail {
  id: string
  promise?: Promise<DataOrError<Decoding | Date>>
}

export interface EventServerEncodeDetail {
  relativeRoot?: string
  user?: string
  id?: string
  encodingType?: EncodingType
  encodeOptions?: EncodeOptions
  mashAssetObject: MashAssetObject
  promise?: Promise<StringDataOrError>
}
export interface EventServerEncodeStatusDetail {
  id: string
  promise?: Promise<DataOrError<Encoding | Date>>
}
export interface EventServerEncodeProgressDetail {
  id: string
  progress: number
}
export interface EventServerTranscodeDetail {
  relativeRoot?: string
  user: string
  id: string
  assetType: AssetType
  request: ServerMediaRequest
  transcodingType: TranscodingType
  transcodeOptions: TranscodeOptions
  promise?: Promise<StringDataOrError>
}
export interface EventServerTranscodeStatusDetail {
  id: string
  promise?: Promise<DataOrError<Transcoding | Date>>
}
export interface EventServerTextRectDetail {
  text: string
  font: string
  height: number
  rect?: Rect
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
  encodingType: AssetType
}


export interface ServerMashDescription extends MashDescription {
  needsPrecoding: boolean
  encodePath: AbsolutePath
  duration: number
  mash: ServerMashAsset
  audioRate: number
  background: string
  videoRate: number
  // cachePromise(): Promise<DataOrError<number>>
  encodeCommandsPromise(): Promise<DataOrError<EncodeCommands>>
  precodeCommandsPromise(): Promise<DataOrError<PrecodeCommands>>
  // encodeMashCommands: EncodeCommands
  // precodeMashCommands: PrecodeCommands | undefined
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
export interface ServerInstance extends Instance {
  asset: ServerAsset
  fileCommandFiles(args: CommandFileArgs): CommandFiles
  initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, container?: boolean): CommandFilters
}

export interface ServerAudibleInstance extends ServerInstance, AudibleInstance {
  asset: ServerAudibleAsset
  audibleCommandFiles(args: AudioCommandFileArgs): CommandFiles
  // audibleCommandFilters(args: AudibleCommandFilterArgs): CommandFilters
}

export interface ServerVisibleInstance extends ServerInstance, VisibleInstance {
  asset: ServerVisibleAsset
  visibleCommandFiles(args: VisibleCommandFileArgs, content?: VisibleContentInstance): CommandFiles


  canColor(args: VisibleCommandFilterArgs): boolean
  canColorTween(args: VisibleCommandFilterArgs): boolean
  

  // commandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, content?: VisibleContentInstance): CommandFilters
  // instanceCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters


  containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters
  scaleCommandFilters(args: VisibleCommandFilterArgs): CommandFilters
  colorBackCommandFilters(args: VisibleCommandFilterArgs, output?: string, intrinsicSize?: Size): CommandFilters
  colorCommandFilters(duration: number, videoRate: number, size: Size, sizeEnd: Size, color: Value, colorEnd: Value): CommandFilters
  containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters
  containerFinalCommandFilters(args: VisibleCommandFilterArgs): CommandFilters
  copyCommandFilter(input: string, track: number, prefix?: string): CommandFilter
  overlayCommandFilters(bottomInput: string, topInput: string, alpha?: boolean): CommandFilters
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