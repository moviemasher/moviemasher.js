import { DefinitionObject } from "../Base/Definition"
import { AndId, Endpoint } from "../declarations"
import { MashObject } from "../Edited/Mash/Mash"
import { OutputOptions } from "../Output/Output"
import { ApiCallback, ApiRequest, ApiResponse } from "./Api"


export interface RenderingResult {
  name: string
}

export interface RenderingInput {
  definitions?: DefinitionObject[]
  mash: MashObject
}

export interface RenderingOptions extends RenderingInput {
  outputs: OutputOptions[]
}

export interface RenderingStartRequest extends ApiRequest, RenderingOptions {
  callback?: ApiCallback
  id?: string
}

export interface RenderingStartResponse extends ApiResponse, AndId {}
