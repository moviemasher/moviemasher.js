import { GenericFactory } from "../../declarations"
import { FilterDefinition } from "../../Filter/Filter"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { ColorTuple } from "../../MoveMe"
import {
  Content, ContentDefinition, ContentDefinitionObject, ContentObject, isContent
} from "../Content"

export interface ColorContentObject extends ContentObject {
  color?: string
}

export interface ColorContentDefinitionObject extends ContentDefinitionObject {
  color?: string
}

export interface ColorContent extends Content {
  definition: ColorContentDefinition
  color: string

  contentColors(time: Time, range: TimeRange): ColorTuple
}
export const isColorContent = (value: any): value is ColorContent => {
  return isContent(value) && "color" in value
}

export interface ColorContentDefinition extends ContentDefinition {
  color: string
  instanceFromObject(object?: ColorContentObject): ColorContent
}

/**
 * @category Factory
 */
export interface ColorContentFactory extends GenericFactory<ColorContent, ColorContentObject, ColorContentDefinition, ColorContentDefinitionObject> { }
