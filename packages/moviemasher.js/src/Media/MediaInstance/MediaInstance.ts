import { Constrained, UnknownObject } from "../../declarations"
import { DefinitionType, MediaDefinitionType } from "../../Setup/Enums"
import { Propertied } from "../../Base/Propertied"
import { isObject } from "../../Utility/Is"
import { Media } from "../Media"
import { Property } from "../../Setup/Property"

export interface MediaInstanceObject extends UnknownObject {
  definitionId?: string
  definition?: Media
  label?: string
}
export const isMediaInstanceObject = (value?: any): value is MediaInstanceObject => {
  return isObject(value) && ("definitionId" in value || "definition" in value)
}

export interface MediaInstance extends Propertied {
  definition: Media
  definitionId: string
  definitionIds(): string[]
  id: string
  label: string
  type: MediaDefinitionType
  propertiesCustom: Property[]
  unload(): void
}

export const isMediaInstance = (value?: any): value is MediaInstance => {
  return isObject(value) && "definitionIds" in value
}

export type MediaInstanceClass = Constrained<MediaInstance>
