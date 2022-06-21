import { UnknownObject } from "../declarations"
import { DefinitionType } from "../Setup/Enums"
import { Definition } from "../Definition/Definition"
import { Time } from "../Helpers/Time/Time"
import { idGenerate } from "../Utility/Id"
import { PropertiedClass } from "../Base/Propertied"
import { isPopulatedObject } from "../Utility/Is"
import { Errors } from "../Setup/Errors"
import { Instance, InstanceObject } from "./Instance"


export class InstanceBase extends PropertiedClass implements Instance {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    if (!isPopulatedObject(object))
      throw Errors.invalid.object

    const { definition } = object as InstanceObject

    if (!definition)
      throw Errors.invalid.definition.object
    this.definition = definition
    this._properties.push(...this.definition.properties)
    this.propertiesInitialize(object)
  }

  copy(): Instance {
    return this.definition.instanceFromObject(this.toJSON())
  }

  definition: Definition

  get definitionId(): string { return this.definition.id }

  definitionIds(): string[] { return [this.definitionId] }

  definitionTime(quantize: number, time: Time): Time {
    return time.scaleToFps(quantize) // may have fps higher than quantize and time.fps
  }

  protected _id?: string
  get id(): string { return this._id ||= idGenerate() }

  protected _label?: string

  get label(): string { return this._label || this.definition.label || this.id }

  set label(value: string) { this._label = value }

  get propertyNames(): string[] {
    return this._properties.map(property => property.name)
  }

  toJSON(): UnknownObject {
    const json = super.toJSON()
    const { definitionId, type } = this
    json.type = type
    json.definitionId = definitionId
    return json
  }

  get type(): DefinitionType { return this.definition.type }
}
