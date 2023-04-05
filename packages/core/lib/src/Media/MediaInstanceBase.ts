import { UnknownRecord } from '../Types/Core.js'
import { MediaType } from '../Setup/MediaType.js'
import { idGenerateString } from '../Utility/Id.js'
import { PropertiedClass } from '../Base/Propertied.js'
import { assertPopulatedObject } from '../Utility/Is.js'
import { Media, MediaInstance, MediaInstanceObject } from './Media.js'
import { ServerPromiseArgs } from '../Base/Code.js'


export class MediaInstanceBase extends PropertiedClass implements MediaInstance {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    assertPopulatedObject(object)
   
    const { definition } = object as MediaInstanceObject
    if (definition) this.definition = definition
    
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

  serverPromise(args: ServerPromiseArgs): Promise<void> {
    return this.definition.serverPromise(args)
  }
  
  toJSON(): UnknownRecord {
    const { mediaId, type, label } = this
    return { ...super.toJSON(), type, label, mediaId}
  }

  get type(): MediaType { return this.definition.type }


  unload() { this.definition.unload() }

}
