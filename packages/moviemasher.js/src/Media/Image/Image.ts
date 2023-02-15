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
  definition?: ImageMedia
}

export interface ImageMediaObject extends MediaObject, UpdatableSizeDefinitionObject {}


export interface Image extends Content, Container, UpdatableSize {
  definition : ImageMedia
}

export const isImage = (value: any): value is Image => {
  return isUpdatableSize(value) 
}

/**
 * @category Media
 */
export interface ImageMedia extends Media, UpdatableSizeDefinition {
  type: ImageType
  instanceFromObject(object?: ImageObject): Image
  loadedImage?: ClientImage
}

export const isImageMedia = (value: any): value is ImageMedia => {
  return isMedia(value) && value.type === ImageType
}
