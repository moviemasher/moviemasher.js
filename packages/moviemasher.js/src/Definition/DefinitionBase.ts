import { UnknownObject } from "../declarations"
import { assertDefinitionType, DefinitionType, isDefinitionType } from "../Setup/Enums"
import { Property } from "../Setup/Property"
import { assertPopulatedString } from "../Utility/Is"
import { Instance, InstanceObject } from "../Instance/Instance"
import { InstanceBase } from "../Instance/InstanceBase"
import { Factory } from "../Definitions/Factory/Factory"
import { Definition, DefinitionObject } from "../Definition/Definition"


export class DefinitionBase implements Definition {
  constructor(...args: any[]) {
    const [object] = args
    const { id, label, icon } = object as DefinitionObject
    assertPopulatedString(id, 'id')

    this.id = id
    this.label = label || id
    if (icon)
      this.icon = icon
  }

  icon?: string

  id: string


  instanceFromObject(object: InstanceObject = {}): Instance {
    return new InstanceBase({ ...this.instanceArgs(object), ...object })
  }

  instanceArgs(object: InstanceObject = {}): InstanceObject {
    const defaults = Object.fromEntries(this.properties.map(property => (
      [property.name, property.defaultValue]
    )))
    return { ...defaults, ...object, definition: this }
  }

  label: string

  properties: Property[] = [];

  get propertiesModular(): Property[] {
    return this.properties.filter(property => isDefinitionType(property.type))
  }

  toJSON(): UnknownObject {
    const object: UnknownObject = { id: this.id, type: this.type }
    if (this.icon)
      object.icon = this.icon
    if (this.label !== this.id)
      object.label = this.label
    return object
  }

  toString(): string { return this.label }

  type!: DefinitionType

  // value(name: string): Scalar | undefined { return this.property(name)?.value }
  static fromObject(object: DefinitionObject): Definition {
    const { id, type } = object
    assertDefinitionType(type)
    assertPopulatedString(id, 'id')
    return Factory[type].definition(object)
  }

}
