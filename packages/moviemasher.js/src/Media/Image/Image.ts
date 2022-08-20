import { Container, ContainerDefinition, ContainerDefinitionObject, ContainerObject } from "../../Container/Container"
import { Content, ContentDefinition, ContentDefinitionObject, ContentObject } from "../../Content/Content"
import { GenericFactory, LoadedImage } from "../../declarations"
import { FilterDefinition } from "../../Filter/Filter"
import {
  UpdatableSize, UpdatableSizeDefinition, UpdatableSizeDefinitionObject, UpdatableSizeObject
} from "../../Mixin/UpdatableSize/UpdatableSize"

export interface ImageObject extends ContentObject, ContainerObject, UpdatableSizeObject {}

export interface ImageDefinitionObject extends ContentDefinitionObject, ContainerDefinitionObject, UpdatableSizeDefinitionObject {
  loadedImage?: LoadedImage
}

export interface Image extends Content, Container, UpdatableSize {
  definition : ImageDefinition
}

export interface ImageDefinition extends ContainerDefinition, ContentDefinition, UpdatableSizeDefinition {
  instanceFromObject(object?: ImageObject): Image
  loadedImage?: LoadedImage
}

/**
 * @category Factory
 */
export interface ImageFactory extends GenericFactory<Image, ImageObject, ImageDefinition, ImageDefinitionObject> {}
