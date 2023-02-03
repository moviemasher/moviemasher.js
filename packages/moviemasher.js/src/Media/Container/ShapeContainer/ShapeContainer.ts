import { Image, ImageDefinition, ImageDefinitionObject, ImageObject } from "../../Image/Image"
import {
  Container, ContainerDefinition, ContainerDefinitionObject, ContainerObject, isContainer
} from "../Container"

export interface ShapeContainerObject extends ImageObject {
}

export interface ShapeContainerDefinitionObject extends ImageDefinitionObject {
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

export interface ShapeContainerDefinition extends ImageDefinition {
  path: string
  pathWidth: number
  pathHeight: number
  instanceFromObject(object?: ShapeContainerObject) : ShapeContainer
}

