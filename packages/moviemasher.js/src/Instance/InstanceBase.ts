import { UnknownObject } from "../declarations"
import { DefinitionType } from "../Setup/Enums"
import { assertDefinition, Definition } from "../Definition/Definition"
import { idGenerateString } from "../Utility/Id"
import { PropertiedClass } from "../Base/Propertied"
import { assertPopulatedObject } from "../Utility/Is"
import { Instance, InstanceObject } from "./Instance"
import { Media } from "../Media/Media"


export class InstanceBase extends PropertiedClass implements Instance {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    assertPopulatedObject(object)
   
    const { definition } = object as InstanceObject
    assertDefinition(definition)

    this.definition = definition
    this.properties.push(...this.definition.properties)
    this.propertiesInitialize(object)
  }

  // copy(): Instance {
  //   return this.definition.instanceFromObject(this.toJSON())
  // }

  definition: Definition

  get definitionId(): string { return this.definition.id }

  definitionIds(): string[] { return [this.definitionId] }

  protected _id?: string
  get id(): string { return this._id ||= idGenerateString() }

  protected _label = ''
  get label(): string { return this._label  }
  set label(value: string) { this._label = value }

  // get propertyNames(): string[] {
  //   return this.properties.map(property => property.name)
  // }

  toJSON(): UnknownObject {
    const json = super.toJSON()
    const { definitionId, type, label } = this
    if (label) json.label = label
    json.type = type
    json.definitionId = definitionId
    return json
  }

  get type(): DefinitionType { return this.definition.type }
}
