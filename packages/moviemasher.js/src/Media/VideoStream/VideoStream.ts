import { AudibleDefinition, AudibleDefinitionObject } from "../../Mixin/Audible/Audible"
import { VisibleDefinition, VisibleObject } from "../../Mixin/Visible/Visible"
import { Transformable } from "../../Mixin/Transformable/Transformable"
import { Audible } from "../../Mixin/Audible/Audible"
import { GenericFactory, Value } from "../../declarations"
import { Streamable, StreamableDefinition, StreamableDefinitionObject } from "../../Mixin/Streamable/Streamable"

export interface VideoStreamObject extends VisibleObject {
  gain?: Value
}

export interface VideoStream extends Audible, Streamable, Transformable {
  definition : VideoStreamDefinition
  copy: VideoStream
}

export interface VideoStreamDefinitionObject extends AudibleDefinitionObject, StreamableDefinitionObject {
  source?: string
  url?: string
}

export interface VideoStreamDefinition extends StreamableDefinition, AudibleDefinition, VisibleDefinition {
  instance : VideoStream
  instanceFromObject(object: VideoStreamObject): VideoStream
}

/**
 * @category Factory
 */
export interface VideoStreamFactory extends GenericFactory<
  VideoStream, VideoStreamObject, VideoStreamDefinition, VideoStreamDefinitionObject
> {}
