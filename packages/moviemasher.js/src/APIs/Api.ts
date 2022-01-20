import { JsonObject, ServerOptions, ValueObject, AndId } from "../declarations"
import { ServerType } from "../Setup/Enums"
import { ContentInit } from "./Content"


export interface ApiInit extends JsonObject {}


export interface ServersInit {
  [ServerType.Api]?: ApiInit
  [ServerType.Hls]?: JsonObject
  [ServerType.Rtmp]?: JsonObject
  [ServerType.Encode]?: JsonObject
  [ServerType.Storage]?: JsonObject
  [ServerType.Webrtc]?: JsonObject
  [ServerType.Content]?: ContentInit
}

/**
 * @category API
 */
export interface ApiServerRequest extends AndId {}

/**
 * @category API
 */
export interface ApiServerResponse extends ServerOptions {}


/**
 * @category API
 */
export interface ApiServersResponse extends ServersInit {}
