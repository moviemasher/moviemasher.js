import { Container, ContainerDefinition, ContainerDefinitionObject, ContainerObject } from "../../Container/Container"
import { Content, ContentDefinition, ContentDefinitionObject, ContentObject } from "../../Content/Content"
import { GenericFactory } from "../../declarations"
import { FilterDefinition } from "../../Filter/Filter"
import {
  UpdatableDimensions, UpdatableDimensionsDefinition, UpdatableDimensionsDefinitionObject, UpdatableDimensionsObject
} from "../../Mixin/UpdatableDimensions/UpdatableDimensions"

export interface ImageObject extends ContentObject, ContainerObject, UpdatableDimensionsObject {}

export interface ImageDefinitionObject extends ContentDefinitionObject, ContainerDefinitionObject, UpdatableDimensionsDefinitionObject {}

export interface Image extends Content, Container, UpdatableDimensions {
  definition : ImageDefinition
}

export interface ImageDefinition extends ContainerDefinition, ContentDefinition, UpdatableDimensionsDefinition {
  instanceFromObject(object?: ImageObject): Image
}

/**
 * @category Factory
 */
export interface ImageFactory extends GenericFactory<Image, ImageObject, ImageDefinition, ImageDefinitionObject> {}
