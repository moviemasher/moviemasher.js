import { UnknownRecord } from "../../declarations"
import { Constrained } from "../../Base/Constrained"
import { MediaType } from "../../Setup/Enums"
import { Propertied } from "../../Base/Propertied"
import { isObject } from "../../Utility/Is"
import { Media } from "../Media"
import { Identified } from "../../Base/Identified"

export interface MediaInstanceObject extends UnknownRecord {
  mediaId?: string
  definition?: Media
  label?: string
}
export const isMediaInstanceObject = (value?: any): value is MediaInstanceObject => {
  return isObject(value) && ("mediaId" in value || "definition" in value)
}

export interface MediaInstance extends Identified, Propertied {
  definition: Media
  mediaId: string
  definitionIds(): string[]
  label: string
  type: MediaType
  unload(): void
}

export const isMediaInstance = (value?: any): value is MediaInstance => {
  return isObject(value) && "definitionIds" in value
}

export type MediaInstanceClass = Constrained<MediaInstance>
