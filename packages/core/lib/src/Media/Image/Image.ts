import type {ClientImage} from '../../Helpers/ClientMedia/ClientMedia.js'
import type {ImageType} from '../../Setup/Enums.js'
import type {Media, MediaObject} from '../Media.js'
import type { Container, ContainerObject } from '../Container/Container.js'
import type { Content, ContentObject } from '../Content/Content.js'
import type {
  UpdatableSizeDefinitionObject, UpdatableSizeObject,
  UpdatableSize, UpdatableSizeDefinition, 
} from '../../Mixin/UpdatableSize/UpdatableSize.js'

import { isUpdatableSize } from '../../Mixin/UpdatableSize/UpdatableSize.js'
import {isMedia} from '../MediaFunctions.js'
import {TypeImage} from '../../Setup/Enums.js'

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
  return isMedia(value) && value.type === TypeImage
}
