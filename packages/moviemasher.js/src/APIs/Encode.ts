
import { JsonObject, Segment, ServerOptions, AndId, WithError } from "../declarations"
import { DefinitionObject } from "../Base/Definition"
import { OutputOptions, OutputObject } from "../Output/Output"
import { EditType } from "../Setup/Enums"
import { MashObject } from "../Edited/Mash/Mash"

export interface EncodeInit extends JsonObject {}


/**
 * @category API
 */
export interface RenderPostRequest {
  server?: ServerOptions
  mash: MashObject
  definitions?: DefinitionObject[]
  output: OutputOptions
}

/**
 * @category API
 */
export interface EncodeOptionsRequest {
  type: EditType
}

/**
 * @category API
 */
export interface EncodeOptionsResponse extends OutputObject {

}

export interface EncodeStreamRequest extends OutputObject { }

export interface EncodeStreamResponse extends AndId {
  readySeconds: number
}

export interface EncodeUpdateRequest extends AndId { segment: Segment }

export interface EncodeUpdateResponse extends WithError  {}
