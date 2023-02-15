import { FontType } from "../../Setup/Enums"
import { isMedia } from "../Media"
import { Container, ContainerDefinition, ContainerDefinitionObject, ContainerObject, isContainer } from "../Container/Container"
import { IdPrefix, IdSuffix } from "../../Setup/Constants"


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

