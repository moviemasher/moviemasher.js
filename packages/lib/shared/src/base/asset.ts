import type { Asset, AssetCacheArgs, AssetObject, AssetType, Assets, ClipObject, DataOrError, Decodings, Instance, InstanceArgs, InstanceObject, Source, Strings } from '@moviemasher/runtime-shared'

import { ASSET_TARGET, AUDIO, CONTAINER, CONTENT, DEFAULT_CONTAINER_ID, ERROR, MASH, STRING, errorThrow, idGenerateString, isArray } from '@moviemasher/runtime-shared'
import { PropertiedClass } from './propertied.js'

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

  assetCachePromise(_args: AssetCacheArgs): Promise<DataOrError<number>> {
    // console.log(this.constructor.name, 'AssetClass.assetCachePromise', _args)
    return Promise.resolve({ data: 0 })
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
      clipObject.sizing = CONTAINER
      clipObject.containerId = id
      clipObject.container = object
    } else {
      clipObject.sizing = CONTENT
      clipObject.contentId = id
      clipObject.content = object
      if (type !== AUDIO) clipObject.containerId = DEFAULT_CONTAINER_ID
    }
    // console.log(this.constructor.name, 'clipObject', clipObject, { id, type, canBeContainer, canBeContent })
    return clipObject
  }

  container = true
  
  content = true

  decodings: Decodings = []

  id: string
  
  override initializeProperties(object: AssetObject): void {
    this.properties.push(this.propertyInstance({
      targetId: ASSET_TARGET, name: `label`, type: STRING, defaultValue: MASH
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
