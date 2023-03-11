import { FontType } from "../../Setup/Enums"
import { Container, ContainerDefinition, ContainerDefinitionObject, ContainerObject } from "../Container/Container"
import { isContainer } from "../Container/ContainerFunctions"
import { IdPrefix, IdSuffix } from "../../Setup/Constants"
import { isMedia } from "../MediaFunctions"


export const DefaultFontId = `${IdPrefix}font${IdSuffix}`


export interface FontMediaObject extends ContainerDefinitionObject {
  string?: string
}

export interface FontObject extends ContainerObject {}

export interface Font extends Container {
  definition: FontMedia
  string: string
}
export const isFont = (value: any): value is Font => {
  return isContainer(value) && "string" in value
}
export function assertFont(value: any): asserts value is Font {
  if (!isFont(value)) throw new Error("expected Font")
}

/**
 * @category Media
 */
export interface FontMedia extends ContainerDefinition {
  type: FontType
  family: string
  instanceFromObject(object?: FontObject): Font
}

export const isFontMedia = (value: any): value is FontMedia => {
  return isMedia(value) && value.type === FontType
}
export function assertFontMedia(value: any): asserts value is FontMedia {
  if (!isFontMedia(value)) throw new Error("expected FontMedia")
}

