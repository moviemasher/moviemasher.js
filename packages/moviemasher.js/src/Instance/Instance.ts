import { Constrained, UnknownObject } from "../declarations"
import { DefinitionType } from "../Setup/Enums"
import { Definition } from "../Definition/Definition"
import { Propertied } from "../Base/Propertied"
import { isObject } from "../Utility/Is"
import { Property } from "../Setup/Property"

export interface InstanceObject extends UnknownObject {
  definitionId?: string
  definition?: Definition
  label?: string
}
export const isInstanceObject = (value?: any): value is InstanceObject => {
  return isObject(value) && ("definitionId" in value || "definition" in value)
}

export interface Instance extends Propertied {
  copy(): Instance
  definition: Definition
  definitionId: string
  definitionIds(): string[]
  propertiesCustom: Property[]
  id: string
  label: string
  propertyNames: string[]
  type: DefinitionType
}

export const isInstance = (value?: any): value is Instance => {
  return isObject(value) && "definitionIds" in value
}

export type InstanceClass = Constrained<Instance>
