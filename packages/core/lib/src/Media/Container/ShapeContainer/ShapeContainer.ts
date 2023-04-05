import {Image, ImageMedia, ImageMediaObject, ImageObject} from '../../Image/Image.js'
import {
  Container, ContainerDefinition, ContainerDefinitionObject, ContainerObject} from '../Container.js'
import {isContainer} from '../ContainerFunctions.js'

export interface ShapeContainerObject extends ImageObject {
}

export interface ShapeContainerDefinitionObject extends ImageMediaObject {
  pathWidth?: number
  pathHeight?: number
  path?: string
}

export interface ShapeContainer extends Image {
  definition: ShapeContainerDefinition
}
export const isShapeContainer = (value: any): value is ShapeContainer => {
  return isContainer(value) && 'path' in value
}

export interface ShapeContainerDefinition extends ImageMedia {
  path: string
  pathWidth: number
  pathHeight: number
  instanceFromObject(object?: ShapeContainerObject) : ShapeContainer
}

