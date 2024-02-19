import type { Asset, AssetCacheArgs, AssetObject, RawType, Assets, ClipObject, DataOrError, Decoding, Decodings, EndpointRequest, Instance, InstanceArgs, InstanceObject, Resource, Resources, Source, Strings } from '../types.js'

import { $ASSET, $AUDIO, $CONTENT, DEFAULT_CONTAINER_ID, ERROR, $MASH, $STRING, arrayUnique, errorThrow, idGenerateString, copyResource } from '../runtime.js'
import { isArray } from '../utility/guard.js'
import { PropertiedClass } from './propertied.js'

export class AssetClass extends PropertiedClass implements Asset {
  constructor(object: AssetObject) {
    super(object)
    const { id, source, type, decodings } = object
    this.id = id || idGenerateString()
    this.source = source
    this.type = type
    if (isArray(decodings)) this.decodings.push(...decodings)
  }

  asset(_: string | AssetObject): Asset { 
    return errorThrow(ERROR.Unimplemented) 
  }

  assetCachePromise(_args: AssetCacheArgs): Promise<DataOrError<number>> {
    return Promise.resolve({ data: 0 })
  }

  get assetIds(): Strings { 
    return arrayUnique([this.id, ...this.assets.flatMap(asset => asset.assetIds)]) 
  }

  get assetObject(): AssetObject {
    const { id, type, decodings, source, scalarRecord, assets, resources } = this
    const object: AssetObject = { 
      id, type, source, ...scalarRecord, decodings, 
      assets: assets.map(asset => asset.assetObject),
      resources: resources.map(copyResource)
    }
    return object
  }

  protected _assets: Assets = []

  get assets(): Assets { return this._assets }

 
  clipObject(object: InstanceObject = {}): ClipObject {
    const clipObject: ClipObject = {}
    const { id, type } = this
    clipObject.sizing = $CONTENT
    clipObject.contentId = id
    clipObject.content = object
    if (type !== $AUDIO) clipObject.containerId = DEFAULT_CONTAINER_ID
    return clipObject
  }

  decodingOfType(...types: Strings): Decoding | undefined {
    for (const type of types) {
      const found = this.decodings.find(decoding => decoding.type === type)
      if (found) return found
    }
    return
  }
  
  get decoding(): Decoding | undefined { return this.decodings[0] }

  decodings: Decodings = []

  id: string
  
  override initializeProperties(object: AssetObject): void {
    const { assets, resources } = object
    if (isArray(assets)) {
      this._assets.push(...assets.map(assetObject => this.asset(assetObject)))
    }
    this.properties.push(this.propertyInstance({
      targetId: $ASSET, name: `label`, type: $STRING, defaultValue: $MASH
    }))
    
    if (resources) this.resources.push(...resources)
    // console.log(this.constructor.name, 'initializeProperties', this.resources)
    super.initializeProperties(object)
  }

  instanceFromObject(_: InstanceObject = {}): Instance {
    return errorThrow(ERROR.Unimplemented)
  }

  instanceArgs(object: InstanceObject = {}): InstanceArgs {
    return { ...object, asset: this, assetId: this.id }
  }


  declare label: string
  
  resourceOfType(...types: Strings): Resource | undefined {
    for (const type of types) {
      const found = this.resources.find(object => object.type === type)
      if (found) return found
    }
    return
  }
  
  get resource(): Resource | undefined { return this.resources[0] }
  
  resources: Resources = []
  
  get request(): EndpointRequest | undefined { 
    return this.resource?.request
  }


  source: Source

  type: RawType
}
