import { Any, JsonObject, LoadPromise, SelectionObject, SelectionValue } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Is } from "../../Utilities/Is"
import { Definition } from "../Definition/Definition"
import { Time } from "../../Utilities/Time"
import { Id } from "../../Utilities";

interface InstanceObject {
  [index: string]: unknown
  definition? : Definition
  id? : string
  label? : string
}

class InstanceClass {
  [index: string]: unknown

  constructor(...args : Any[]) {
    const [object] = args
    if (!Is.populatedObject(object)) throw Errors.invalid.object + 'InstanceClass'

    const { definition, id, label } = <InstanceObject> object
    if (!definition) throw Errors.invalid.definition.object + 'InstanceClass'

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

  load(quantize : number, start : Time, end? : Time) : LoadPromise {
    const startTime = this.definitionTime(quantize, start)
    const endTime = end ? this.definitionTime(quantize, end) : end
    return this.definition.load(startTime, endTime)
  }

  loaded(quantize : number, start : Time, end? : Time) : boolean {
    const startTime = this.definitionTime(quantize, start)
    const endTime = end ? this.definitionTime(quantize, end) : end
    return this.definition.loaded(startTime, endTime)
  }

  get propertyNames() : string[] {
    return this.definition.properties.map(property => property.name)
  }
  get propertyValues() : SelectionObject {
    return Object.fromEntries(this.definition.properties.map(property => {
      return [property.name, this.value(property.name)]
    }))
  }

  get type() : DefinitionType { return this.definition.type }

  toJSON() : JsonObject { return this.propertyValues }

  value(key : string) : SelectionValue {
    const value = this[key]
    if (typeof value === "undefined") throw Errors.property + "value " + this.propertyNames.includes(key) + " " + this[key]

    return <SelectionValue> value
  }
}

interface Instance extends InstanceClass {

}

export { Instance, InstanceClass, InstanceObject }
