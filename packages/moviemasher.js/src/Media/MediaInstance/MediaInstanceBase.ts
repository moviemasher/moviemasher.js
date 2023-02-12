import { UnknownRecord } from "../../declarations"
import { MediaType } from "../../Setup/Enums"
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

  get mediaId(): string { return this.definition.id }

  definitionIds(): string[] { return [this.mediaId] }

  protected _id?: string
  get id(): string { return this._id ||= idGenerateString() }

  protected _label = ''
  get label(): string { return this._label  }
  set label(value: string) { this._label = value }

  toJSON(): UnknownRecord {
    const { mediaId, type, label } = this
    return { ...super.toJSON(), type, label, mediaId}
  }

  get type(): MediaType { return this.definition.type }


  unload() { this.definition.unload() }

}
