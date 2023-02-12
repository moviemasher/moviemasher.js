import { UnknownRecord } from "../declarations"
import { PreloadArgs, ServerPromiseArgs } from "../Base/Code"
import { assertMediaType, DataType, MediaType } from "../Setup/Enums"

import { Property, propertyInstance } from "../Setup/Property"
import { assertPopulatedString } from "../Utility/Is"
import { requestPromise } from "../Utility/Request"
import { Size } from "../Utility/Size"
import { Media, MediaObject } from "./Media"
import { MediaInstance, MediaInstanceObject } from "./MediaInstance/MediaInstance"
import { MediaInstanceBase } from "./MediaInstance/MediaInstanceBase"
import { Decodings } from "../Decode/Decoding/Decoding"
import { decodingInstance } from "../Decode/Decoding/DecodingFactory"
import { Transcoding, Transcodings } from "../Transcode/Transcoding/Transcoding"
import { transcodingInstance } from "../Transcode/Transcoding/TranscodingFactory"
import { RequestableClass } from "../Base/Requestable/RequestableClass"
import { Requestable } from "../Base/Requestable/Requestable"
import { Default } from "../Setup/Default"
import { errorThrow } from "../Helpers/Error/ErrorFunctions"
import { ErrorName } from "../Helpers/Error/ErrorName"

export class MediaBase extends RequestableClass implements Media { 
  constructor(object: MediaObject) {
    super(object)
    const { decodings, transcodings, file } = object 
    if (file) this.file = file
    if (decodings) this.decodings.push(...decodings.map(decodingInstance))
    if (transcodings) this.transcodings.push(...transcodings.map(transcodingInstance))

    const { type } = this
    assertMediaType(type)

    this.properties.push(propertyInstance({ 
      name: 'label', type: DataType.String, defaultValue: Default[type].label
    }))
  }

  declare type: MediaType
  
  unload(): void {
    throw new Error("Method not implemented.")
  }

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    return errorThrow(ErrorName.Unimplemented)
  }
  
  file?: File | undefined

  findTranscoding(type: MediaType, ...kind: string[]): Transcoding | undefined {
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
  
  declare label: string
  
  loadPromise(args: PreloadArgs): Promise<void> { 
    return errorThrow(ErrorName.Unimplemented)
  }

  preferredTranscoding(...types: MediaType[]): Requestable {
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
  
  toJSON(): UnknownRecord {
    const { label, decodings, transcodings } = this
    return { ...super.toJSON(), label, decodings, transcodings }
  }

  transcodings: Transcodings = []
  properties: Property[] = []
  decodings: Decodings = []
  serverPath = ''
}