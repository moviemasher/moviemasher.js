
import { AssetType, Source } from "@moviemasher/runtime-shared"
import { PropertiedClass } from "../../Base/PropertiedClass.js"
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'
import { InstanceObject, Instance, InstanceArgs } from '../Instance/Instance.js'
import { Transcoding, TranscodingType, TranscodingTypes, Transcodings } from '../../Plugin/Transcode/Transcoding/Transcoding.js'
import { Asset, AssetObject } from './Asset.js'
import { Strings } from "@moviemasher/runtime-shared"
import { Decodings } from "../../Plugin/Decode/Decoding/Decoding.js"
import { ImportedAssets } from "../Imported/ImportedTypes.js"
import { propertyInstance } from "../../Setup/PropertyFunctions.js"
import { DataTypeBoolean } from "../../Setup/DataTypeConstants.js"
import { AssetCacheArgs } from "../../index.js"

export class AssetClass extends PropertiedClass implements Asset {
  constructor(object: AssetObject) {
    super(object)
    const { id } = object
    this.id = id
  }
  assetCachePromise(args: AssetCacheArgs): Promise<void> {
    return Promise.resolve()
  }

  get assetIds(): Strings { return [this.id] }

  findTranscoding(transcodingType: TranscodingType, ...kinds: Strings): Transcoding | undefined {
    return this.transcodings.find(transcoding => {
      const { type, kind } = transcoding
      if (transcodingType !== type) return false
      if (kinds.length && !kinds.includes(kind)) return false
      return true
    })
  }
  
  importedAssets: ImportedAssets = []

  initializeProperties(object: unknown): void {
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

  id: string
  
  isVector = false

  declare label: string
  
  preferredAsset(...types: TranscodingTypes): Transcoding | undefined {
    for (const type of types) {
      const found = this.transcodings.find(object => object.type === type)
      if (found) return found
    }
  }

  eventTarget?: EventTarget | undefined;

  transcodings: Transcodings = []

  decodings: Decodings = []

  type!: AssetType
  source!: Source
}