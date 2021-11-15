import { AudibleDefinition, AudibleDefinitionObject } from "../Mixin/Audible/Audible"
import { VisibleDefinition, VisibleObject } from "../Mixin/Visible/Visible"
import { Transformable } from "../Mixin/Transformable/Transformable"
import { Audible } from "../Mixin/Audible/Audible"
import { GenericFactory, ScalarValue } from "../../declarations"
import { Streamable, StreamableDefinition, StreamableDefinitionObject } from "../Mixin/Streamable/Streamable"

interface VideoStreamObject extends VisibleObject {
  gain?: ScalarValue
}

interface VideoStream extends Audible, Streamable, Transformable {
  definition : VideoStreamDefinition
  copy: VideoStream
}

interface VideoStreamDefinitionObject extends AudibleDefinitionObject, StreamableDefinitionObject {
  source?: string
  url?: string
}

interface VideoStreamDefinition extends StreamableDefinition, AudibleDefinition, VisibleDefinition {
  instance : VideoStream
  instanceFromObject(object: VideoStreamObject): VideoStream
}

type VideoStreamFactory = GenericFactory<VideoStream, VideoStreamObject, VideoStreamDefinition, VideoStreamDefinitionObject>

export { VideoStream, VideoStreamDefinition, VideoStreamDefinitionObject, VideoStreamFactory, VideoStreamObject }
