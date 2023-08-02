import type { Asset, AssetCacheArgs, AssetObject, AssetType, ClipObject, Decodings, Instance, InstanceArgs, InstanceObject, Source, Strings, Transcoding, TranscodingType, TranscodingTypes, Transcodings } from '@moviemasher/runtime-shared'

import { ErrorName, TypeAudio, errorThrow } from '@moviemasher/runtime-shared'

import { PropertiedClass } from '../../Base/PropertiedClass.js'
import { decodingInstance } from '../../Plugin/Decode/Decoding/DecodingFactory.js'
import { transcodingInstance } from '../../Plugin/Transcode/Transcoding/TranscodingFactory.js'
import { DataTypeString } from '../../Setup/DataTypeConstants.js'
import { Default } from '../../Setup/Default.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { idGenerateString } from '../../Utility/IdFunctions.js'
import { TypeAsset } from '@moviemasher/runtime-client'
import { SizingContainer, SizingContent } from '../../Setup/SizingConstants.js'

export class AssetClass extends PropertiedClass implements Asset {
  constructor(object: AssetObject) {
    super(object)
    const { id, decodings, transcodings } = object
    this.id = id || idGenerateString()
    if (decodings) this.decodings.push(...decodings.map(decodingInstance))
    if (transcodings) this.transcodings.push(...transcodings.map(transcodingInstance))

  }
  assetCachePromise(_args: AssetCacheArgs): Promise<void> {
    return Promise.resolve()
  }

  get assetIds(): Strings { return [this.id] }

  canBeContainer = true
  canBeContent = true
  
  clipObject(object: InstanceObject = {}): ClipObject {
    const clipObject: ClipObject = {}
    const { id, type, isVector } = this
    if (isVector) { 
      clipObject.sizing = SizingContainer
      clipObject.containerId = id
      clipObject.container = object
    }
    else {
      clipObject.sizing = SizingContent
      clipObject.contentId = id
      clipObject.content = object
    }

    if (type === TypeAudio) clipObject.containerId = ''
    return clipObject
  }

  container = true
  
  content = true

  findTranscoding(transcodingType: TranscodingType, ...kinds: Strings): Transcoding | undefined {
    return this.transcodings.find(transcoding => {
      const { type, kind } = transcoding
      if (transcodingType !== type) return false
      if (kinds.length && !kinds.includes(kind)) return false
      return true
    })
  }

  override initializeProperties(object: AssetObject): void {
    this.properties.push(propertyInstance({
      targetId: TypeAsset, name: `label`, type: DataTypeString, 
      defaultValue: Default.mash.label
    }))
    super.initializeProperties(object)
  }

  instanceFromObject(object: InstanceObject = {}): Instance {
    return errorThrow(ErrorName.Unimplemented)
  }

  instanceArgs(object: InstanceObject = {}): InstanceArgs {
    return { ...object, asset: this, assetId: this.id }
  }

  declare id: string
  
  isVector = false

  declare label: string
  
  preferredTranscoding(...types: TranscodingTypes): Transcoding | undefined {
    for (const type of types) {
      const found = this.transcodings.find(object => object.type === type)
      if (found) return found
    }
  }

  transcodings: Transcodings = []

  decodings: Decodings = []

  type!: AssetType
  source!: Source
}