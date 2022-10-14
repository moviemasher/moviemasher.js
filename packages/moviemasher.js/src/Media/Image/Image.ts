import { Container, ContainerDefinition, ContainerDefinitionObject, ContainerObject } from "../../Container/Container"
import { Content, ContentDefinition, ContentDefinitionObject, ContentObject } from "../../Content/Content"
import { GenericFactory, LoadedImage } from "../../declarations"
import { isDefinition } from "../../Definition/Definition"
import { FilterDefinition } from "../../Filter/Filter"
import {
  UpdatableSize, UpdatableSizeDefinition, UpdatableSizeDefinitionObject, UpdatableSizeObject
} from "../../Mixin/UpdatableSize/UpdatableSize"
import { DefinitionType } from "../../Setup/Enums"

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
export const isImageDefinition = (value: any): value is ImageDefinition => {
  return isDefinition(value) && value.type === DefinitionType.Image
}



/**
 * @category Factory
 */
export interface ImageFactory extends GenericFactory<Image, ImageObject, ImageDefinition, ImageDefinitionObject> {}
