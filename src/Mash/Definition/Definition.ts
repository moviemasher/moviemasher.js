import { DataType, DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Any, Constrained, JsonObject, LoadPromise, SelectionValue, UnknownObject } from "../../declarations"
import { Instance, InstanceBase, InstanceObject } from "../Instance/Instance"
import { Property } from "../../Setup/Property"
import { Time, Times } from "../../Utilities/Time"
import { Is } from "../../Utilities"

interface DefinitionObject {
  [index: string]: unknown
  id? : string
  type? : string
  label? : string
  icon? : string
}

class DefinitionBase {
  constructor(...args : Any[]) {
    const [object] = args
    const { id, label, icon } = <DefinitionObject> object
    if (!(id && Is.populatedString(id))) throw Errors.invalid.definition.id + JSON.stringify(object)
    this.id = id

    this.label = label || id
    if (icon) this.icon = icon

    this.properties.push(new Property({ name: "label", type: DataType.String, value: "" }))
  }

  icon? : string

  id : string

  get instance() : Instance {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : InstanceObject) : Instance {
    const instance = new InstanceBase({ ...this.instanceObject, ...object })
    return instance
  }

  get instanceObject() : InstanceObject {
    const object : UnknownObject = {}
    object.definition = this
    this.properties.forEach(property => {
      object[property.name] = property.value
    })
    return object
  }

  label : string

  loadDefinition(_quantize: number, _start : Time, _end? : Time) : LoadPromise | void { }

  definitionUrls(_start: Time, _end?: Time): string[] { return [] }

  properties : Property[] = []

  get propertiesModular() : Property[] { return this.properties.filter(property => property.type.modular) }

  property(name : string) : Property | undefined {
    return this.properties.find(property => property.name === name)
  }

  retain = false

  toJSON() : JsonObject {
    const object : JsonObject = { id: this.id, type: this.type }
    if (this.icon) object.icon = this.icon
    if (this.label !== this.id) object.label = this.label
    return object
  }

  type! : DefinitionType

  unload(_times : Times[] = []) : void {}

  value(name : string) : SelectionValue | undefined {
    const property = this.property(name)
    if (!property) return

    return property.value
  }
}

interface Definition extends DefinitionBase {}

type DefinitionTimes = Map<Definition, Times[]>

type DefinitionClass = Constrained<DefinitionBase>

export { Definition, DefinitionClass, DefinitionBase, DefinitionObject, DefinitionTimes }
