import type { ServerMashAsset, AVType, AbsolutePath, AssetObject, DataOrError, DropType, Importer, MashDescriptionArgs, Mimetype, MovieMasherOptions, MovieMasherRuntime, OutputOptions, Propertied, SegmentDescription, SegmentDescriptionArgs, Time, Clip, ServerAsset, CommandFilters, CommandInputRecord, EncodeDescription, PrecodeDescription, ServerMashDescription, ServerMashDescriptionOptions, RawProbeData } from '@moviemasher/shared-lib/types.js'
import type { EventEmitter } from "events"

export interface ServerImporter extends Importer {
  icon: Node
}

export interface FilterArgs {
  propertied?: Propertied
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

export interface CommandProbeFunction {
  (error: any, data: RawProbeData): void
}

export interface Command extends EventEmitter {
  _getArguments(): string[]
  ffprobe(callback: CommandProbeFunction): void
  kill(signal: string): void
  mergeAdd(file: string): Command
  mergeToFile(destination: string, tmpFolder: string): Command
  output(destination: string): Command
  run(): void
  save(output: string): Command
}

