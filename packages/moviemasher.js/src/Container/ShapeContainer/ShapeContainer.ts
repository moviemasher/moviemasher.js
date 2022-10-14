import { GenericFactory } from "../../declarations"
import {
  Container, ContainerDefinition, ContainerDefinitionObject, ContainerObject, isContainer
} from "../Container"

export interface ShapeContainerObject extends ContainerObject {
}

export interface ShapeContainerDefinitionObject extends ContainerDefinitionObject {
  pathWidth?: number
  pathHeight?: number
  path?: string
}

export interface ShapeContainer extends Container {
  definition: ShapeContainerDefinition
}
export const isShapeContainer = (value: any): value is ShapeContainer => {
  return isContainer(value) && "path" in value
}

export interface ShapeContainerDefinition extends ContainerDefinition {
  path: string
  pathWidth: number
  pathHeight: number
  instanceFromObject(object?: ShapeContainerObject) : ShapeContainer
}

/**
 * @category Factory
 */
export interface ShapeContainerFactory extends GenericFactory<ShapeContainer, ShapeContainerObject, ShapeContainerDefinition, ShapeContainerDefinitionObject> {}
