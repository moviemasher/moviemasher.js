import { UnknownObject } from "../../declarations"
import { DefinitionType } from "../../Setup/Enums"
import { idGenerateString } from "../../Utility/Id"
import { PropertiedClass } from "../../Base/Propertied"
import { assertPopulatedObject } from "../../Utility/Is"
import { MediaInstance, MediaInstanceObject } from "./MediaInstance"
import { Media } from "../Media"


export class MediaInstanceBase extends PropertiedClass implements MediaInstance {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    assertPopulatedObject(object)
   
    const { definition } = object as MediaInstanceObject
    if (definition) this.definition = definition
    // assertMedia(definition)
    
    this.properties.push(...this.definition.properties)
    this.propertiesInitialize(object)
  }

  definition!: Media 

  get definitionId(): string { return this.definition.id }

  definitionIds(): string[] { return [this.definitionId] }

  protected _id?: string
  get id(): string { return this._id ||= idGenerateString() }

  protected _label = ''
  get label(): string { return this._label  }
  set label(value: string) { this._label = value }

  toJSON(): UnknownObject {
    const json = super.toJSON()
    const { definitionId, type, label } = this
    if (label) json.label = label
    json.type = type
    json.definitionId = definitionId
    return json
  }

  get type(): DefinitionType { return this.definition.type }


  unload() { this.definition.unload() }

}
