
import { AssetType, Source } from "@moviemasher/runtime-shared"
import { errorThrow } from '@moviemasher/runtime-shared'
import { ErrorName } from '@moviemasher/runtime-shared'
import { InstanceObject, Instance, InstanceArgs } from '@moviemasher/runtime-shared'
import { Transcoding, TranscodingType, TranscodingTypes, Transcodings } from '@moviemasher/runtime-shared'
import { AssetCacheArgs } from "@moviemasher/runtime-shared"
import { Asset, AssetObject } from '@moviemasher/runtime-shared'
import { Strings } from "@moviemasher/runtime-shared"
import { Decodings } from "@moviemasher/runtime-shared"

import { PropertiedClass } from "../../Base/PropertiedClass.js"
import { propertyInstance } from "../../Setup/PropertyFunctions.js"
import { DataTypeBoolean } from "../../Setup/DataTypeConstants.js"
import { idGenerateString } from "../../Utility/IdFunctions.js"
import { decodingInstance } from "../../Plugin/Decode/Decoding/DecodingFactory.js"
import { transcodingInstance } from "../../Plugin/Transcode/Transcoding/TranscodingFactory.js"

export class AssetClass extends PropertiedClass implements Asset {
  constructor(object: AssetObject) {
    super(object)
    const { id, decodings, transcodings } = object
    this.id = id || idGenerateString()
    if (decodings) this.decodings.push(...decodings.map(decodingInstance))
    if (transcodings) this.transcodings.push(...transcodings.map(transcodingInstance))

  }
  assetCachePromise(args: AssetCacheArgs): Promise<void> {
    return Promise.resolve()
  }

  get assetIds(): Strings { return [this.id] }

  canBeContainer = true
  canBeContent = true
  
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
  
  initializeProperties(object: AssetObject): void {
    this.properties.push(propertyInstance({ 
      name: 'muted', type: DataTypeBoolean 
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