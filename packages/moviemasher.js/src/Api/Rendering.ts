import { DefinitionObjects } from "../Definition/Definition"
import { AndId, UploadDescription, ValueObject } from "../declarations"
import { CommandFilters, GraphFilters } from "../MoveMe"
import { MashObject } from "../Edited/Mash/Mash"
import { CommandOutput, CommandOutputs, RenderingCommandOutput } from "../Output/Output"
import { AVType, LoadType, OutputType } from "../Setup/Enums"
import { ApiCallback, ApiCallbackResponse, ApiRequest } from "./Api"

export interface CommandInput {
  source: string
  options?: ValueObject
}
export type CommandInputs = CommandInput[]


export interface CommandOptions extends CommandDescription {
  output: CommandOutput
}

export interface CommandDescription {
  duration?: number
  inputs?: CommandInputs
  commandFilters?: CommandFilters
  avType: AVType
}


export interface RenderingResult {
  error?: string
  warning?: string
  outputType: OutputType
  destination?: string
}

export interface RenderingDescription {
  audibleCommandDescription?: CommandDescription
  visibleCommandDescriptions?: CommandDescriptions
  commandOutput: RenderingCommandOutput
}

export type CommandDescriptions = CommandDescription[]

export interface RenderingState {
  total: number
  completed: number
}

export type RenderingStatus = {
  [index in OutputType]?: RenderingState
}

export interface RenderingInput {
  definitions?: DefinitionObjects
  mash: MashObject
}

export interface RenderingOptions extends RenderingInput {
  upload?: boolean
  outputs: CommandOutputs
}

/**
 * Start rendering a mash object
 * @swagger rendering/start
 */
export interface RenderingStartRequest extends ApiRequest, RenderingOptions {}

export interface RenderingStartResponse extends ApiCallbackResponse {}

export interface RenderingStatusRequest extends ApiRequest, AndId {
  renderingId: string
}
export interface RenderingStatusResponse extends ApiCallbackResponse, RenderingStatus {}

export interface RenderingUploadRequest extends ApiRequest, UploadDescription {
}
export interface RenderingUploadResponse extends ApiCallbackResponse {
  id?: string
  fileProperty?: string
  loadType?: LoadType
  fileApiCallback?: ApiCallback
}
