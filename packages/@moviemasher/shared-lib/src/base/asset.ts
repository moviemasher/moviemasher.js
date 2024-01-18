import type { Asset, AssetCacheArgs, AssetObject, AssetType, Assets, ClipObject, DataOrError, Decodings, EndpointRequests, Instance, InstanceArgs, InstanceObject, Source, Strings } from '../types.js'

import { ASSET_TARGET, AUDIO, CONTENT, DEFAULT_CONTAINER_ID, ERROR, MASH, STRING, arrayUnique, errorThrow, idGenerateString, isArray } from '../runtime.js'
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

  get assetIds(): Strings { 
    return arrayUnique([this.id, ...this.assets.flatMap(asset => asset.assetIds)]) 
  }

  get assetObject(): AssetObject {
    const { id, type, decodings, source, scalarRecord, assets } = this
    const object: AssetObject = { 
      id, type, source, ...scalarRecord, decodings, 
      assets: assets.map(asset => asset.assetObject)
    }
    return object
  }

  protected _assets: Assets = []

  get assets(): Assets { return this._assets }

  protected _requests: EndpointRequests = []

  get requests(): EndpointRequests { return this._requests }

  clipObject(object: InstanceObject = {}): ClipObject {
    const clipObject: ClipObject = {}
    const { id, type } = this
    clipObject.sizing = CONTENT
    clipObject.contentId = id
    clipObject.content = object
    if (type !== AUDIO) clipObject.containerId = DEFAULT_CONTAINER_ID
    return clipObject
  }

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


  declare label: string
  
  source: Source

  type: AssetType
}
