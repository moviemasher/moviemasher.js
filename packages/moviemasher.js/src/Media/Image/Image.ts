import { Container, ContainerDefinition } from "../../Container/Container"
import { Content, ContentDefinition, ContentDefinitionObject, ContentObject } from "../../Content/Content"
import { GenericFactory } from "../../declarations"
import { FilterDefinition } from "../../Filter/Filter"
import {
  UpdatableDimensions, UpdatableDimensionsDefinition, UpdatableDimensionsDefinitionObject, UpdatableDimensionsObject
} from "../../Mixin/UpdatableDimensions/UpdatableDimensions"

export interface ImageObject extends ContentObject, UpdatableDimensionsObject {}

export interface ImageDefinitionObject extends ContentDefinitionObject, UpdatableDimensionsDefinitionObject {}

export interface Image extends Content, Container, UpdatableDimensions {
  definition : ImageDefinition
}

export interface ImageDefinition extends ContainerDefinition, ContentDefinition, UpdatableDimensionsDefinition {
  instanceFromObject(object?: ImageObject): Image
  setptsFilterDefinition: FilterDefinition
}

/**
 * @category Factory
 */
export interface ImageFactory extends GenericFactory<Image, ImageObject, ImageDefinition, ImageDefinitionObject> {}
