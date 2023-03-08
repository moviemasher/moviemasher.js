import { Image, ImageMedia, ImageMediaObject, ImageObject } from "../../Image/Image"
import {
  Container, ContainerDefinition, ContainerDefinitionObject, ContainerObject} from "../Container"
import { isContainer } from "../ContainerFunctions"

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
  return isContainer(value) && "path" in value
}

export interface ShapeContainerDefinition extends ImageMedia {
  path: string
  pathWidth: number
  pathHeight: number
  instanceFromObject(object?: ShapeContainerObject) : ShapeContainer
}

