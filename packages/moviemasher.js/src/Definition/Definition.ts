import { Constrained, Described, UnknownObject } from "../declarations"
import { DefinitionType, isDefinitionType } from "../Setup/Enums"
import { Property } from "../Setup/Property"
import { Times } from "../Helpers/Time/Time"
import { isObject } from "../Utility/Is"
import { Instance, InstanceObject } from "../Instance/Instance"
import { throwError } from "../Utility/Throw"

export interface DefinitionObject extends UnknownObject, Partial<Described> {
  type?: DefinitionType | string
}


export type DefinitionObjects = DefinitionObject[]

export interface Definition {
  icon?: string
  id: string
  instanceFromObject(object?: InstanceObject): Instance
  instanceArgs(object?: InstanceObject): InstanceObject
  label: string
  properties: Property[]
  propertiesModular: Property[]
  toJSON(): UnknownObject
  type: DefinitionType
}

export type DefinitionClass = Constrained<Definition>
export type DefinitionTimes = Map<Definition, Times[]>

export const isDefinition = (value: any): value is Definition => {
  return isObject(value) && isDefinitionType(value.type) && "instanceFromObject" in value
}
export function assertDefinition(value: any, name?: string): asserts value is Definition {
  if (!isDefinition(value)) throwError(value, 'Definition', name)
}