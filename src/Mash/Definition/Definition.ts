import { DataType, DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Any, JsonObject, LoadPromise, SelectionValue, UnknownObject } from "../../declarations"
import { Instance, InstanceClass, InstanceObject } from "../Instance/Instance"
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

class DefinitionClass {
  constructor(...args : Any[]) {
    const [object] = args
    const { id, label, icon } = <DefinitionObject> object
    if (!(id && Is.populatedString(id))) throw Errors.invalid.definition.id + JSON.stringify(object)
    this.id = id

    if (label) this.label = label
    if (icon) this.icon = icon

    this.properties.push(new Property({ name: "label", type: DataType.String, value: "" }))
  }

  icon? : string

  id : string

  get instance() : Instance {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : InstanceObject) : Instance {
    const instance = new InstanceClass({ ...this.instanceObject, ...object })
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

  label? : string

  load(_start : Time, _end? : Time) : LoadPromise { return Promise.resolve() }

  loaded(_start : Time, _end? : Time) : boolean { return true }

  loadedAudible(_time?: Time) : Any {}

  loadedVisible(_time?: Time) : Any {}

  properties : Property[] = []

  get propertiesModular() : Property[] { return this.properties.filter(property => property.type.modular) }

  property(name : string) : Property | undefined {
    return this.properties.find(property => property.name === name)
  }

  retain = false

  toJSON() : JsonObject {
    const object : JsonObject = { id: this.id, type: this.type }
    if (this.icon) object.icon = this.icon
    if (this.label) object.label = this.label
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

interface Definition extends DefinitionClass {}

type DefinitionTimes = Map<Definition, Times[]>

export { Definition, DefinitionClass, DefinitionObject, DefinitionTimes }
