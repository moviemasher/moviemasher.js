import { ClientImage } from "../../ClientMedia/ClientMedia"
import { ImageType, MediaType } from "../../Setup/Enums"
import { 
  Container, ContainerObject 
} from "../Container/Container"
import { 
  Content, ContentObject 
} from "../Content/Content"
import {
  isUpdatableSize,
  UpdatableSize, UpdatableSizeDefinition, UpdatableSizeDefinitionObject, 
  UpdatableSizeObject
} from "../../Mixin/UpdatableSize/UpdatableSize"
import { isMedia, Media, MediaObject } from "../Media"

export interface ImageObject extends ContentObject, ContainerObject, UpdatableSizeObject {
  definition?: ImageDefinition
}

export interface ImageDefinitionObject extends MediaObject, UpdatableSizeDefinitionObject {}

export type ImageTransitionalObject = MediaObject | ImageDefinitionObject

export interface Image extends Content, Container, UpdatableSize {
  definition : ImageDefinition
}

export const isImage = (value: any): value is Image => {
  return isUpdatableSize(value) 
}
export interface ImageDefinition extends Media, UpdatableSizeDefinition {
  type: ImageType
  instanceFromObject(object?: ImageObject): Image
  loadedImage?: ClientImage
}

export const isImageDefinition = (value: any): value is ImageDefinition => {
  return isMedia(value) && value.type === ImageType
}
