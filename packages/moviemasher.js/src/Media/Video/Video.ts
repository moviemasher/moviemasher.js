import { GenericFactory } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"
import { isInstance } from "../../Instance/Instance"
import { FilterDefinition } from "../../Filter/Filter"
import {
  UpdatableDimensions, UpdatableDimensionsDefinition, UpdatableDimensionsDefinitionObject, UpdatableDimensionsObject
} from "../../Mixin/UpdatableDimensions/UpdatableDimensions"
import {
  Content, ContentDefinition, ContentDefinitionObject, ContentObject
} from "../../Content/Content"
import { UpdatableDuration, UpdatableDurationDefinition, UpdatableDurationDefinitionObject, UpdatableDurationObject } from "../../Mixin/UpdatableDuration/UpdatableDuration"
import { Container, ContainerDefinition, ContainerDefinitionObject, ContainerObject } from "../../Container/Container"

export interface VideoObject extends ContainerObject, ContentObject, UpdatableDimensionsObject, UpdatableDurationObject {
  speed?: number
}

export interface Video extends Content, Container, UpdatableDimensions, UpdatableDuration {
  definition : VideoDefinition
}

export interface VideoDefinitionObject extends ContainerDefinitionObject, ContentDefinitionObject, UpdatableDimensionsDefinitionObject, UpdatableDurationDefinitionObject {
  fps?: number
}

export interface VideoDefinition extends ContainerDefinition, ContentDefinition, UpdatableDimensionsDefinition, UpdatableDurationDefinition {
  instanceFromObject(object?: VideoObject): Video
  setsarFilterDefinition: FilterDefinition
  fpsFilterDefinition: FilterDefinition
}

export const isVideo = (value: any): value is Video => {
  return isInstance(value) && value.definition.type === DefinitionType.Video
}

export function assertVideo(value: any): asserts value is Video {
  if (!isVideo(value)) throw new Error('expected Video')
}

/**
 * @category Factory
 */
export interface VideoFactory extends GenericFactory<
  Video, VideoObject, VideoDefinition, VideoDefinitionObject
> {}
