import type { Asset, AssetCacheArgs, AssetObject, AssetType, Assets, ClipObject, Decodings, Instance, InstanceArgs, InstanceObject, Source, Strings } from '@moviemasher/runtime-shared'

import { ERROR, TypeAsset, AUDIO, errorThrow, isArray } from '@moviemasher/runtime-shared'
import { PropertiedClass } from '../../Base/PropertiedClass.js'
import { DataTypeString } from '../../Setup/DataTypeConstants.js'
import { Default } from '../../Setup/Default.js'
import { propertyInstance } from '../../Setup/PropertyFunctions.js'
import { SizingContainer, SizingContent } from '../../Setup/SizingConstants.js'
import { idGenerateString } from '../../Utility/IdFunctions.js'

export class AssetClass extends PropertiedClass implements Asset {
  constructor(object: AssetObject) {
    super(object)
    const { id, source, type, decodings, assets } = object
    this.id = id || idGenerateString()
    this.source = source
    this.type = type
    if (isArray(decodings)) this.decodings.push(...decodings)
    if (isArray(assets)) {
      this._assets.push(...assets.map(assetObject => this.asset(assetObject)))
    }
  }

  asset(_id: string | AssetObject): Asset { 
    return errorThrow(ERROR.Unimplemented) 
  }

  assetCachePromise(_args: AssetCacheArgs): Promise<void> {
    console.log(this.constructor.name, 'AssetClass.assetCachePromise', _args)
    return Promise.resolve()
  }

  get assetIds(): Strings { return [this.id] }

  get assetObject(): AssetObject {
    const { id, type, decodings, source, scalarRecord, assets } = this
    // const assets = assetIds.map(id => this.asset(id).assetObject)
    const object: AssetObject = { 
      id, type, source, ...scalarRecord, decodings, 
      assets: assets.map(asset => asset.assetObject)
    }
    return object
  }

  private _assets: Assets = []

  get assets(): Assets { return this._assets }

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
    if (type === AUDIO) clipObject.containerId = ''
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
    return errorThrow(ERROR.Unimplemented)
  }

  instanceArgs(object: InstanceObject = {}): InstanceArgs {
    return { ...object, asset: this, assetId: this.id }
  }

  isVector = false

  declare label: string
  
  source: Source

  type: AssetType
}