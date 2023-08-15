import type { Asset, AssetCacheArgs, AssetObject, AssetType, ClipObject, Decodings, Instance, InstanceArgs, InstanceObject, Source, Strings } from '@moviemasher/runtime-shared'

import { TypeAsset } from '@moviemasher/runtime-client'
import { ErrorName, TypeAudio, errorThrow } from '@moviemasher/runtime-shared'
import { PropertiedClass } from '../../Base/PropertiedClass.js'
import { decodingInstance } from '../../Plugin/Decode/Decoding/DecodingFactory.js'
import { DataTypeString } from '../../Setup/DataTypeConstants.js'
import { Default } from '../../Setup/Default.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { SizingContainer, SizingContent } from '../../Setup/SizingConstants.js'
import { idGenerateString } from '../../Utility/IdFunctions.js'

export class AssetClass extends PropertiedClass implements Asset {
  constructor(object: AssetObject) {
    super(object)
    const { id, source, type, decodings } = object
    this.id = id || idGenerateString()
    this.source = source
    this.type = type
    if (decodings) this.decodings.push(...decodings.map(decodingInstance))
  }
  assetCachePromise(_args: AssetCacheArgs): Promise<void> {
    return Promise.resolve()
  }

  get assetIds(): Strings { return [this.id] }

  get assetObject(): AssetObject {
    const { id, type, decodings, source, scalarRecord } = this
    const object: AssetObject = { id, type, source, ...scalarRecord, decodings }
    return object
  }

  canBeContainer = true
  canBeContent = true
  
  clipObject(object: InstanceObject = {}): ClipObject {
    const clipObject: ClipObject = {}
    const { id, type, canBeContainer, canBeContent } = this
    if (canBeContainer && !canBeContent) { 
      clipObject.sizing = SizingContainer
      clipObject.containerId = id
      clipObject.container = object
    } else {
      clipObject.sizing = SizingContent
      clipObject.contentId = id
      clipObject.content = object
    }
    if (type === TypeAudio) clipObject.containerId = ''
    return clipObject
  }

  container = true
  
  content = true

  decodings: Decodings = []

  id: string
  
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

  isVector = false

  declare label: string
  
  source: Source

  type: AssetType
}