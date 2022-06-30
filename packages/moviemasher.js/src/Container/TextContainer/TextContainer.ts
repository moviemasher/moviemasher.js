import { GenericFactory } from "../../declarations"
import { FilterDefinition } from "../../Filter/Filter"
import { FontDefinition } from "../../Media/Font/Font"
import {
  Container, ContainerDefinition, ContainerDefinitionObject, ContainerObject, isContainer
} from "../Container"

export interface TextContainerObject extends ContainerObject {
  fontId?: string
  string?: string
  intrinsicOffset?: number
}

export interface TextContainerDefinitionObject extends ContainerDefinitionObject {

}

export interface TextContainer extends Container {
  definition: TextContainerDefinition
  font: FontDefinition
  fontId: string
  string: string
}
export const isTextContainer = (value: any): value is TextContainer => {
  return isContainer(value) && "fontId" in value
}
export function assertTextContainer(value: any): asserts value is TextContainer {
  if (!isTextContainer(value)) throw new Error("expected TextContainer")
}

export interface TextContainerDefinition extends ContainerDefinition {
  instanceFromObject(object?: TextContainerObject): TextContainer
}

/**
 * @category Factory
 */
export interface TextContainerFactory extends GenericFactory<TextContainer, TextContainerObject, TextContainerDefinition, TextContainerDefinitionObject> {}
