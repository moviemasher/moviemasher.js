import { DefinitionObjects } from "../Base/Definition"
import { AndId, GraphFilters, ValueObject } from "../declarations"
import { MashObject } from "../Edited/Mash/Mash"
import { CommandOutput, CommandOutputs } from "../Output/Output"
import { OutputType } from "../Setup/Enums"
import { ApiCallback, ApiRequest, ApiResponse } from "./Api"

export interface CommandInput {
  source: string
  options?: ValueObject
}
export type CommandInputs = CommandInput[]
export interface CommandOptions {
  inputs?: CommandInputs
  output?: CommandOutput
  graphFilters?: GraphFilters
}

export interface CommandArgs extends Required<CommandOptions> {}

export interface RenderingResult {
  error?: string
  outputType: OutputType
  destination: string
}

export interface RenderingInput {
  definitions?: DefinitionObjects
  mash: MashObject
}

export interface RenderingOptions extends RenderingInput {
  outputs: CommandOutputs
}

export interface RenderingStartRequest extends ApiRequest, RenderingOptions {
  callback?: ApiCallback
  id?: string
}

export interface RenderingStartResponse extends ApiResponse, AndId {}
