import { Constrained, GenericFactory } from "../../declarations"
import {
  AudibleFile, AudibleFileObject, AudibleFileDefinition, AudibleFileDefinitionObject
} from "../../Mixin/AudibleFile/AudibleFile"
import {
  Transformable, TransformableDefinitionObject, TransformableDefinition, TransformableObject
} from "../../Mixin/Transformable/Transformable"

interface VideoObject extends AudibleFileObject, TransformableObject {
  speed?: number
}

interface Video extends AudibleFile, Transformable {
  definition : VideoDefinition
  copy : Video
  speed : number
}

interface VideoDefinitionObject extends AudibleFileDefinitionObject, TransformableDefinitionObject {
  fps?: number
  source?: string
  url?: string
}

interface VideoDefinition extends AudibleFileDefinition, TransformableDefinition {
  absoluteUrl: string
  instance : Video
  instanceFromObject(object: VideoObject): Video
}

/**
 * @category Factory
 */
interface VideoFactory extends GenericFactory<
  Video, VideoObject, VideoDefinition, VideoDefinitionObject
> {}



export {
  Video, VideoDefinition, VideoDefinitionObject,
  VideoFactory, VideoObject
}
