import { 
  Constrained, Described, Endpoint, LoadedImage, SvgItem, SvgOrImage, UnknownObject 
} from "../declarations"
import { DefinitionType, isDefinitionType } from "../Setup/Enums"
import { Property } from "../Setup/Property"
import { Times } from "../Helpers/Time/Time"
import { isObject } from "../Utility/Is"
import { Instance, InstanceObject } from "../Instance/Instance"
import { throwError } from "../Utility/Throw"
import { Size } from "../Utility/Size"
import { Loader } from "../Loader/Loader"


export interface DefinitionObject extends UnknownObject, Partial<Described> {
  type?: DefinitionType | string
}
export const isDefinitionObject = (value: any): value is DefinitionObject => {
  return isObject(value) && "id" in value && (!value.type || isDefinitionType(value.type))
}

export type DefinitionObjects = DefinitionObject[]

export interface Definition {
  definitionIcon(loader: Loader, size: Size): Promise<SVGSVGElement> | undefined
  id: string
  instanceFromObject(object?: InstanceObject): Instance
  instanceArgs(object?: InstanceObject): InstanceObject
  label: string
  properties: Property[]
  propertiesModular: Property[]
  toJSON(): UnknownObject
  type: DefinitionType
}

export type Definitions = Definition[]


export type DefinitionClass = Constrained<Definition>
export type DefinitionTimes = Map<Definition, Times[]>

export const isDefinition = (value: any): value is Definition => {
  return isObject(value) && isDefinitionType(value.type) && "instanceFromObject" in value
}
export function assertDefinition(value: any, name?: string): asserts value is Definition {
  if (!isDefinition(value)) throwError(value, 'Definition', name)
}