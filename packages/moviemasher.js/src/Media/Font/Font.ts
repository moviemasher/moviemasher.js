import { FontType } from "../../Setup/Enums"
import { isMedia } from "../Media"
import { Container, ContainerDefinition, ContainerDefinitionObject, ContainerObject, isContainer } from "../Container/Container"
import { IdPrefix, IdSuffix } from "../../Setup/Constants"


export const DefaultFontId = `${IdPrefix}font${IdSuffix}`


export interface FontDefinitionObject extends ContainerDefinitionObject {
  string?: string
}

export interface FontObject extends ContainerObject {}

export interface Font extends Container {
  definition: FontDefinition
  string: string
}
export const isFont = (value: any): value is Font => {
  return isContainer(value) && "string" in value
}
export function assertFont(value: any): asserts value is Font {
  if (!isFont(value)) throw new Error("expected Font")
}

export interface FontDefinition extends ContainerDefinition {
  type: FontType
  family: string
  instanceFromObject(object?: FontObject): Font
}

export const isFontDefinition = (value: any): value is FontDefinition => {
  return isMedia(value) && value.type === FontType
}
export function assertFontDefinition(value: any): asserts value is FontDefinition {
  if (!isFontDefinition(value)) throw new Error("expected FontDefinition")
}

