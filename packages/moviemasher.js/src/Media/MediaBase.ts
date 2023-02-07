import { Defined } from "../Base/Defined"
import { UnknownObject } from "../declarations"
import { PreloadArgs, ServerPromiseArgs } from "../MoveMe"
import { DefinitionType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { Property } from "../Setup/Property"
import { assertPopulatedString } from "../Utility/Is"
import { requestPromise } from "../Utility/Request"
import { Size } from "../Utility/Size"
import { Media, MediaObject } from "./Media"
import { MediaInstance, MediaInstanceObject } from "./MediaInstance/MediaInstance"
import { MediaInstanceBase } from "./MediaInstance/MediaInstanceBase"
import { Decodings } from "../Decode/Decoding/Decoding"
import { decodingInstance } from "../Decode/Decoding/DecodingFactory"
import { Transcoding, Transcodings } from "../Transcode/Transcoding/Transcoding"
import { TranscodingClass } from "../Transcode/Transcoding/TranscodingClass"
import { transcodingInstance } from "../Transcode/Transcoding/TranscodingFactory"

export class MediaBase extends TranscodingClass implements Media { 
  constructor(object: MediaObject) {
    super(object)
    
    const { 
      label, decodings, transcodings, 
    } = object 
 
    if (label) this.label = label
    if (decodings) this.decodings.push(...decodings.map(decodingInstance))
    if (transcodings) this.transcodings.push(...transcodings.map(transcodingInstance))
  }
  propertiesCustom!: Property[]

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    throw new Error(Errors.unimplemented)
  }
  
  findTranscoding(type: DefinitionType, ...kind: string[]): Transcoding | undefined {
    return this.transcodings.find(transcoding => {
      if (transcoding.type !== type) return false

      if (!kind.length) return true
      return kind.includes(transcoding.kind)
    })
  }
  instanceFromObject(object: MediaInstanceObject = {}): MediaInstance {
    return new MediaInstanceBase(this.instanceArgs(object))
  }

  instanceArgs(object: MediaInstanceObject = {}): MediaInstanceObject {
    const defaults = Object.fromEntries(this.properties.map(property => (
      [property.name, property.defaultValue]
    )))
    return { ...defaults, ...object, definition: this }
  }

  isVector = false
  
  loadPromise(args: PreloadArgs): Promise<void> { 
    throw new Error(Errors.unimplemented)
  }

  preferredTranscoding(...types: DefinitionType[]): Transcoding {
    for (const type of types) {
      const found = this.transcodings.find(object => object.type === type)
      if (found) return found
    }
    return this
  }

  serverPromise(args: ServerPromiseArgs): Promise<void> {

    if (this.serverPath) return Promise.resolve()

    const { request } = this
    return requestPromise(request).then(response => {
      const { error, path } = response
      if (!error) {
        assertPopulatedString(path, 'path')
        this.serverPath = path
      }
    })
  }
  
  toJSON(): UnknownObject {
    const { label, decodings, transcodings } = this
    return { ...super.toJSON(), label, decodings, transcodings }
  }

  label: string = ''
  transcodings: Transcodings = []
  properties: Property[] = []
  decodings: Decodings = []
  serverPath = ''

  static fromObject(object: MediaObject): Media {
    const { id } = object
    assertPopulatedString(id, 'id')
    return Defined.definition(object)
  }
}