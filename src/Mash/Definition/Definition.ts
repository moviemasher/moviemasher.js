import { DataType, DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Any, JsonObject, LoadPromise, ScalarValue, UnknownObject } from "../../Setup/declarations"
import { Is } from "../../Utilities/Is"
import { Instance, InstanceClass, InstanceObject } from "../Instance/Instance"
import { Property } from "../../Setup/Property"
import { Time, Times } from "../../Utilities/Time"

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
    if (!Is.populatedObject(object)) throw Errors.unknown.definition

    const { id, label, icon } = <DefinitionObject> object
    if (!id) throw Errors.id


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

  label : string

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
    const object : JsonObject = { id: this.id, type: this.type, label: this.label }
    if (this.icon) object.icon = this.icon
    return object
  }

  type! : DefinitionType

  unload(_times : Times[] = []) : void {}

  value(name : string) : ScalarValue | undefined {
    const property = this.property(name)
    if (!property) return

    return property.value
  }
}

interface Definition extends DefinitionClass {}

type DefinitionTimes = Map<Definition, Times[]>

export { Definition, DefinitionClass, DefinitionObject, DefinitionTimes }
