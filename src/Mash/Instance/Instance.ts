import { Any, Constrained, JsonObject, LoadPromise, SelectionObject, SelectionValue, UnknownObject } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utilities/Is"
import { Definition } from "../Definition/Definition"
import { Time } from "../../Utilities/Time"
import { Id } from "../../Utilities"

interface InstanceObject extends UnknownObject {
  definition? : Definition
  id? : string
  label? : string
}

class InstanceBase {
  [index: string]: unknown

  constructor(...args : Any[]) {
    const [object] = args
    if (!Is.populatedObject(object)) throw Errors.invalid.object + 'InstanceBase'

    const { definition, id, label } = <InstanceObject> object
    if (!definition) throw Errors.invalid.definition.object + 'InstanceBase'

    this.definition = definition
    if (id && id !== definition.id) this._id = id
    if (label && label !== definition.label) this._label = label
  }

  get copy() : Instance {
    return this.definition.instanceFromObject(this.toJSON())
  }

  definition : Definition

  get definitions() : Definition[] { return [this.definition] }

  definitionTime(quantize : number, time : Time) : Time {
    return time.scaleToFps(quantize) // may have fps higher than quantize and time.fps
  }

  protected _id? : string

  get id() : string { return this._id || this.definition.id }

  private _identifier?: string

  get identifier() : string { return this._identifier ||= Id() }

  protected _label? : string

  get label() : string { return this._label || this.definition.label || this.id }

  set label(value : string) { this._label = value }

  get propertyNames() : string[] {
    return this.definition.properties.map(property => property.name)
  }

  get propertyValues() : SelectionObject {
    return Object.fromEntries(this.definition.properties.map(property => {
      return [property.name, this.value(property.name)]
    }))
  }

  setValue(key: string, value: SelectionValue): boolean {
    const property = this.definition.property(key)
    if (!property) throw Errors.property + key

    const { type } = property
    const coerced = type.coerce(value)
    if (typeof coerced === 'undefined') {
      console.error(this.constructor.name, "setValue", key, value)
      return false
    }

    this[key] = coerced
    return true
  }

  toJSON() : JsonObject { return this.propertyValues }

  get type() : DefinitionType { return this.definition.type }

  value(key : string) : SelectionValue {
    const value = this[key]
    if (typeof value === "undefined") throw Errors.property + key

    return <SelectionValue> value
  }
}

interface Instance extends InstanceBase {}

type InstanceClass = Constrained<InstanceBase>

export { Instance, InstanceClass, InstanceBase, InstanceObject }
