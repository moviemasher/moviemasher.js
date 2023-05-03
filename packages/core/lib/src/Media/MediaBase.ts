import type { Decodings } from '../Plugin/Decode/Decoding/Decoding.js'
import type { ClientAudioEventDetail, ClientFontEventDetail, ClientImageEventDetail, ClientMediaEventDetail, ClientVideoEventDetail, Media, MediaInstance, MediaInstanceObject, MediaObject } from './Media.js'
import type { MediaType } from '../Setup/MediaType.js'
import type { PreloadArgs, ServerPromiseArgs } from '../Base/Code.js'
import type { Property } from '../Setup/Property.js'
import type { Requestable } from '../Base/Requestable/Requestable.js'
import type { Size } from '../Utility/Size.js'
import type { Transcoding, Transcodings, TranscodingTypes } from '../Plugin/Transcode/Transcoding/Transcoding.js'
import type { UnknownRecord } from '../Types/Core.js'
import type { EndpointRequest } from '../Helpers/Request/Request.js'

import { assertMediaType } from '../Setup/MediaType.js'
import { DataTypeString } from '../Setup/Enums.js'
import { decodingInstance } from '../Plugin/Decode/Decoding/DecodingFactory.js'
import { Default } from '../Setup/Default.js'
import { ErrorName } from '../Helpers/Error/ErrorName.js'
import { errorThrow } from '../Helpers/Error/ErrorFunctions.js'
import { assertDefined, isDefiniteError } from '../Utility/Is.js'
import { MediaInstanceBase } from './MediaInstanceBase.js'
import { propertyInstance } from '../Setup/Property.js'
import { RequestableClass } from '../Base/Requestable/RequestableClass.js'
import { requestPromise } from '../Helpers/Request/RequestFunctions.js'
import { transcodingInstance } from '../Plugin/Transcode/Transcoding/TranscodingFactory.js'
import { TypeString } from '../Utility/Scalar.js'
// import {requestImagePromise, requestVideoPromise, requestFontPromise, requestAudioPromise } from '../Helpers/Request/RequestFunctions.js'
import { ClientAudioDataOrError, ClientFontDataOrError, ClientImageDataOrError, ClientVideoDataOrError } from '../Helpers/ClientMedia/ClientMedia.js'

export class MediaBase extends RequestableClass implements Media { 
  constructor(object: MediaObject) {
    super(object)
    const { decodings, transcodings, file } = object 
    if (file) this.file = file
    if (decodings) this.decodings.push(...decodings.map(decodingInstance))
    if (transcodings) this.transcodings.push(...transcodings.map(transcodingInstance))

    const { type } = this
    assertMediaType(type)
    
    const defaultValue = Default[type].label
    this.properties.push(propertyInstance({ 
      name: 'label', type: DataTypeString, defaultValue
    }))
  }

  declare type: MediaType
  
  unload(): void {
    throw new Error('Method not implemented.')
  }

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    return //errorThrow(ErrorName.Unimplemented)
  }
  
  eventTarget?: EventTarget | undefined
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

  preferredTranscoding(...types: TranscodingTypes): Requestable {
    for (const type of types) {
      const found = this.transcodings.find(object => object.type === type)
      if (found) return found
    }
    return this
  }

  requestAudioPromise(request: EndpointRequest): Promise<ClientAudioDataOrError> { 
    const detail: ClientAudioEventDetail = { request }
    this.eventTarget?.dispatchEvent(new CustomEvent('clientaudio', { detail }))
    const { promise } = detail
    assertDefined(promise)
    return promise // requestAudioPromise(request)
  }

  requestFontPromise(request: EndpointRequest): Promise<ClientFontDataOrError> {
    const detail: ClientFontEventDetail = { request }
    this.eventTarget?.dispatchEvent(new CustomEvent('clientfont', { detail }))
    const { promise } = detail
    assertDefined(promise)
    return promise // requestFontPromise(request)
  }

  requestImagePromise(request: EndpointRequest): Promise<ClientImageDataOrError> {
    const detail: ClientImageEventDetail = { request }
    this.eventTarget?.dispatchEvent(new CustomEvent('clientimage', { detail }))
    const { promise } = detail
    assertDefined(promise)
    return promise // requestImagePromise(request)
  }
  requestVideoPromise(request: EndpointRequest): Promise<ClientVideoDataOrError> {
    const detail: ClientVideoEventDetail = { request }
    this.eventTarget?.dispatchEvent(new CustomEvent('clientvideo', { detail }))
    const { promise } = detail
    assertDefined(promise)
    return promise // requestVideoPromise(request)
  }

  serverPromise(args: ServerPromiseArgs): Promise<void> {
    if (this.serverPath) return Promise.resolve()

    const { request } = this
    return requestPromise(request, TypeString).then(orError => {
      if (!isDefiniteError(orError)) {
        const { data } = orError
        this.serverPath = data
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

