import { AudibleDefinition, AudibleDefinitionObject } from "../Mixin/Audible/Audible"
import { VisibleDefinition, VisibleObject } from "../Mixin/Visible/Visible"
import { Transformable } from "../Mixin/Transformable/Transformable"
import { Audible, AudibleObject } from "../Mixin/Audible/Audible"
import { GenericFactory, ScalarValue } from "../../declarations"
import { Time } from "../../Utilities"

interface VideoObject extends AudibleObject, VisibleObject {
  speed?: number
}

interface Video extends Audible, Transformable {
  definition : VideoDefinition
  copy : Video
  speed : number
}

interface VideoDefinitionObject extends AudibleDefinitionObject {
  begin?: number
  video_rate? : ScalarValue
  fps? : ScalarValue
  increment? : number
  pattern? : string
  source? : string
  url? : string
}

interface VideoDefinition extends Omit <AudibleDefinition, "loadedVisible">, Omit <VisibleDefinition, "loadedAudible"> {
  instance : Video
  instanceFromObject(object : VideoObject) : Video
  urls(start : Time, end? : Time) : string[]

}

type VideoFactory = GenericFactory<Video, VideoObject, VideoDefinition, VideoDefinitionObject>

export { Video, VideoDefinition, VideoDefinitionObject, VideoFactory, VideoObject }
