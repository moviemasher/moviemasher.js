import {
  Any, Constrained, JsonObject, SelectionObject, UnknownObject
} from "../declarations"
import { DefinitionType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { Is } from "../Utilities/Is"
import { Definition } from "./Definition"
import { Time } from "../Utilities/Time"
import { idGenerate } from "../Utilities/Id"
import { PropertiedClass, Property } from "../Setup/Property"
import { Definitions } from "../Definitions/Definitions"

interface InstanceObject extends UnknownObject {
  definition?: Definition
  definitionId?: string
  id?: string
  label?: string
}

class InstanceBase extends PropertiedClass {
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    if (!Is.populatedObject(object)) throw Errors.invalid.object + 'InstanceBase'

    const { definitionId = '', definition, id, label } = <InstanceObject>object
    const definitionObject = definition || Definitions.fromId(definitionId)
    if (!definitionObject) throw Errors.invalid.definition.object

    this.definition = definitionObject
    if (id) this._id = id
    if (label && label !== this.definition.label) this._label = label
  }

  get copy() : Instance {
    return this.definition.instanceFromObject(this.toJSON())
  }

  definition : Definition

  get definitionId(): string { return this.definition.id }

  get definitions() : Definition[] { return [this.definition] }

  definitionTime(quantize : number, time : Time) : Time {
    return time.scaleToFps(quantize) // may have fps higher than quantize and time.fps
  }

  private _id? : string

  get id() : string { return this._id ||= idGenerate() }

  protected _label? : string

  get label() : string { return this._label || this.definition.label || this.id }

  set label(value : string) { this._label = value }

  get properties(): Property[] { return this.definition.properties }

  property(key: string): Property | undefined { return this.definition.property(key) }

  get propertyNames() : string[] {
    return this.properties.map(property => property.name)
  }

  get propertyValues() : SelectionObject {
    return Object.fromEntries(this.properties.map(property => {
      return [property.name, this.value(property.name)]
    }))
  }

  toJSON(): JsonObject {
    // console.debug(this.constructor.name, "toJSON")
    const object = {
      definitionId: this.definitionId,
      id: this.id,
      type: this.type,
      ...this.propertyValues
    }
    return object
  }

  get type() : DefinitionType { return this.definition.type }
}

interface Instance extends InstanceBase {}

type InstanceClass = Constrained<InstanceBase>

export { Instance, InstanceClass, InstanceBase, InstanceObject }
