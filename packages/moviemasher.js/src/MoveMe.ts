import { AVType, MediaDefinitionType, Orientation, OutputType } from "./Setup/Enums"
import { Time, TimeRange } from "./Helpers/Time/Time"
import { Definition } from "./Definition/Definition"
import { Propertied } from "./Base/Propertied"
import { EmptyMethod } from "./Setup/Constants"
import { Filter } from "./Module/Filter/Filter"
import { JsonObject, StringObject, ValueObject } from "./declarations"
import { Size } from "./Utility/Size"
import { Rect, RectTuple } from "./Utility/Rect"
import { LoaderType } from "./Loader/Loader"
import { isObject, isPopulatedString } from "./Utility/Is"
import { errorsThrow } from "./Utility/Errors"
import { Media, Medias } from "./Media/Media"
import { MashObject } from "./Edited"
import { isRequestObject, RequestObject, RequestObjects } from "./Api/Api"
import { RenderingCommandOutput } from "./Output/Output"

export interface CommandFilter {
  avType?: AVType
  ffmpegFilter: string
  inputs: string[]
  outputs: string[]
  options: ValueObject
}

export type CommandFilters = CommandFilter[]

export interface GraphFilter extends CommandFilter {
  filter: Filter
}
export type GraphFilters = GraphFilter[]

export interface FilterValueObject {
  filter: Filter
  valueObject: ValueObject
}
export type FilterValueObjects = FilterValueObject[]

export interface PreloadOptionsBase {
  audible?: boolean
  editing?: boolean
  visible?: boolean
  icon?: boolean
  streaming?: boolean
  time: Time
}

export interface ServerPromiseArgs {
  streaming?: boolean
  visible?: boolean
  audible?: boolean
  time: Time
}

export interface PreloadArgs extends PreloadOptionsBase {
  quantize: number
  clipTime: TimeRange
}

export interface PreloadOptions extends Partial<PreloadOptionsBase> {
  quantize?: number
  clipTime?: TimeRange
}

export type ColorTuple = [string, string]

export interface CommandFileOptions {
  streaming?: boolean
  visible?: boolean
  time: Time
  quantize: number
  outputSize?: Size
  containerRects?: RectTuple
  contentColors?: ColorTuple
  videoRate: number
  clipTime?: TimeRange
}

export interface CommandFileArgs extends CommandFileOptions {
  clipTime: TimeRange
}
export interface VisibleCommandFileArgs extends CommandFileArgs {
  outputSize: Size
  containerRects: RectTuple
}
export interface CommandFilterArgs extends CommandFileArgs {
  track: number
  commandFiles: CommandFiles
  chainInput: string
  filterInput?: string
}
export interface VisibleCommandFilterArgs extends CommandFilterArgs {
  outputSize: Size
  containerRects: RectTuple
  duration: number
}

export interface FilterArgs {
  propertied?: Propertied
}

export interface FilterCommandFilterArgs extends FilterArgs {
  commandFiles?: CommandFiles,
  chainInput?: string, 
  filterInput?: string
  dimensions?: Size
  videoRate: number
  duration: number
}

export interface FilterCommandFileArgs extends FilterArgs {
  outputSize: Size
  containerRects: RectTuple
  clipTime: TimeRange
  streaming?: boolean
  visible?: boolean
  time: Time
  quantize: number
  contentColors?: ColorTuple
  videoRate: number
  duration: number
}

export interface FilterDefinitionArgs extends FilterArgs {
  filter: Filter
}

export interface FilterDefinitionCommandFilterArgs extends FilterCommandFilterArgs {
  filter: Filter
}

export interface FilterDefinitionCommandFileArgs extends FilterCommandFileArgs {
  filter: Filter
}

export interface GraphFile {
  type: LoaderType
  file: string
  content?: string
  input?: boolean
  definition: Media | Definition
  resolved?: string
}
export type GraphFiles = GraphFile[]

export interface CommandFile extends GraphFile {
  options?: ValueObject
  inputId: string
}

export type CommandFiles = CommandFile[]

export interface DefinitionRecord extends Record<string, Definition> { }

export type VoidMethod = typeof EmptyMethod


export interface PotentialError {
  error?: { message: string }
}
export interface PathOrError extends PotentialError {
  path?: string
}

export interface MediaResponse extends PathOrError {

}

export interface MediaRequest {
  callback?: RequestObject | RequestObjects
  input: Input
  output: Output
  id: string
}
export const isMediaRequest = (value: any): value is MediaRequest => {
  return isObject(value) && isPopulatedString(value.id) && isObject(value.input)
}
export function assertMediaRequest(value: any): asserts value is MediaRequest {
  if (!isMediaRequest(value)) errorsThrow(value, 'MediaRequest')
}


export interface Input {
  request?: RequestObject
}

export interface DecodeInput extends Required<Input> {
  type: MediaDefinitionType
}
export interface EncodeInput extends Input {
  mash?: MashObject
  media?: Medias
}

export interface TranscodeInput extends Required<Input> {
  type: MediaDefinitionType
}

export interface Output {
  request: RequestObject
}
export const isOutput = (value: any): value is Output => {
  return isObject(value) && isRequestObject(value.request)
}

export interface DecodeOutput extends Output {
  type: OutputType
}
export interface EncodeOutput extends Output {
  commandOutput: RenderingCommandOutput
}
export interface TranscodeOutput extends Output {
  commandOutput: RenderingCommandOutput
  type: OutputType
}

export interface InputResponse extends PotentialError {
  idPaths: StringObject
}

export interface DecodeRequest extends MediaRequest {
  input: DecodeInput
  output: DecodeOutput
}
export const isDecodeRequest = (value: any): value is DecodeRequest => {
  return isMediaRequest(value) 
} 
export function assertDecodeRequest(value: any): asserts value is DecodeRequest {
  if (!isDecodeRequest(value)) errorsThrow(value, 'DecodeRequest')
}
export interface EncodeRequest extends MediaRequest {
  input: EncodeInput
  output: EncodeOutput
}
export const isEncodeRequest = (value: any): value is EncodeRequest => {
  return isMediaRequest(value) 
} 
export function assertEncodeRequest(value: any): asserts value is EncodeRequest {
  if (!isEncodeRequest(value)) errorsThrow(value, 'EncodeRequest')
}
export interface TranscodeRequest extends MediaRequest {
  input: TranscodeInput
  output: TranscodeOutput
}
export const isTranscodeRequest = (value: any): value is TranscodeRequest => {
  return isMediaRequest(value) && "output" in value && isOutput(value.output)
}

export function assertTranscodeRequest(value: any): asserts value is TranscodeRequest {
  if (!isTranscodeRequest(value)) errorsThrow(value, 'TranscodeRequest')
}

export interface CallbackRequestBody extends PotentialError {
  id: string
  completed: number
}

export interface DecodeResponse extends MediaResponse {
  info?: any
  width?: number
  height?: number
  duration?: number
  alpha?: boolean
  audio?: boolean
}

export interface EncodeResponse extends MediaResponse {}

export interface TranscodeResponse extends MediaResponse, PathOrError {}

export type EnvScope = Record<string, string | undefined>

export interface MediaEvent {
  body: string
}

export enum JobType {
  Decoding = 'decoding',
  Encoding = 'encoding',
  Transcoding = 'transcoding',
}

export const JobTypes = Object.values(JobType)
export const isJobType = (value: any): value is JobType => {
  return JobTypes.includes(value as JobType)
}
export function assertJobType(value: any, name?: string): asserts value is JobType {
  if (!isJobType(value)) errorsThrow(value, 'JobType', name) 
}

export type JobTuple = [JobType, JsonObject]


export interface SvgImageOptions extends Partial<Rect> {
  lock?: Orientation
}

export enum Component {
  Browser = 'browser',
  Player = 'player',
  Inspector = 'inspector',
  Timeline = 'timeline',
}

export interface ResponseObject {
  json(): Promise<any>

}