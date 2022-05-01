import { PreloadableDefinition } from "../../Base/PreloadableDefinition"
import { GenericFactory } from "../../declarations"
import {
  AudibleFile, AudibleFileObject, AudibleFileDefinition, AudibleFileDefinitionObject
} from "../../Mixin/AudibleFile/AudibleFile"
import {
  Transformable, TransformableDefinitionObject, TransformableDefinition, TransformableObject
} from "../../Mixin/Transformable/Transformable"

export interface VideoObject extends AudibleFileObject, TransformableObject {
  speed?: number
}

export interface Video extends AudibleFile, Transformable {
  definition : VideoDefinition
  copy : Video
  speed : number
}

export interface VideoDefinitionObject extends AudibleFileDefinitionObject, TransformableDefinitionObject {
  fps?: number
  source?: string
  url?: string
}

export interface VideoDefinition extends AudibleFileDefinition, TransformableDefinition, PreloadableDefinition {
  instance : Video
  instanceFromObject(object: VideoObject): Video
}

/**
 * @category Factory
 */
export interface VideoFactory extends GenericFactory<
  Video, VideoObject, VideoDefinition, VideoDefinitionObject
> {}
