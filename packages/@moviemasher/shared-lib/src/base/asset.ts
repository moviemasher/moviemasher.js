import type { Asset, AssetCacheArgs, AssetObject, RawType, Assets, ClipObject, DataOrError, Decoding, Decodings, EndpointRequest, Instance, InstanceArgs, InstanceObject, Resource, Resources, Source, Strings, AssetArgs, AssetManager, ResourceType, Usage } from '../types.js'

import { $ASSET, $AUDIO, $CONTENT, DEFAULT_CONTAINER_ID, ERROR, $MASH, $STRING, arrayUnique, errorThrow, idGenerateString, copyResource, assertAsset, jsonStringify, isDefiniteError } from '../runtime.js'
import { isArray } from '../utility/guard.js'
import { PropertiedClass } from './propertied.js'
import { isUsage } from '../utility/guards.js'

export class AssetClass extends PropertiedClass implements Asset {
  constructor(object: AssetArgs) {
    super(object)
    const { assets, resources, id, source, type, decodings, assetManager } = object
    this.assetManager = assetManager
    this.id = id || idGenerateString()
    this.source = source
    this.type = type

    this.properties.push(this.propertyInstance({
      targetId: $ASSET, name: 'label', type: $STRING, defaultValue: $MASH
    }))
    if (isArray(resources)) this.resources.push(...resources)
    if (isArray(decodings)) this.decodings.push(...decodings)
    if (isArray(assets)) {
      this._assets.push(...assets.map(assetObject => this.asset(assetObject.id)))
    }
  }

  asset(assetId: string): Asset {
    const assetOrError = this.assetManager.get(assetId)
    if (!isDefiniteError(assetOrError)) {
      const { data: asset } = assetOrError
      assertAsset(asset, jsonStringify(assetId))

      return asset
    }
    return errorThrow(assetOrError)
  }

  assetCachePromise(_args: AssetCacheArgs): Promise<DataOrError<number>> {
    return Promise.resolve({ data: 0 })
  }

  get assetIds(): Strings { 
    return arrayUnique([this.id, ...this.assets.flatMap(asset => asset.assetIds)]) 
  }
  
  declare assetManager: AssetManager

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

  hasIntrinsicTiming?: boolean

  hasIntrinsicSizing?: boolean

  declare id: string
  
  instanceFromObject(_: InstanceObject = {}): Instance {
    return errorThrow(ERROR.Unimplemented)
  }

  instanceArgs(object: InstanceObject = {}): InstanceArgs {
    return { ...object, asset: this, assetId: this.id }
  }

  // declare label: string
  
  resourceOfType(...types: Array<ResourceType | Usage>): Resource | undefined {
    const { resources } = this
    const usages = types.filter(isUsage)
    const resourceTypes = types.filter(type => !isUsage(type))
    const filtered = usages.length ? this.resourcesOfUsage(...usages) : resources
    for (const type of resourceTypes) {
      const found = filtered.find(object => object.type === type)
      if (found) return found
    }
    return
  }
  
  get resource(): Resource | undefined { return this.resources[0] }
  
  resources: Resources = []

  private resourcesOfUsage(...usages: Usage[]): Resources {
    const withUsage = this.resources.filter(resource => resource.usage)
    return withUsage.filter(resource => usages.includes(resource.usage!))
  }

  get request(): EndpointRequest | undefined { 
    return this.resource?.request
  }

  declare source: Source

  declare type: RawType
}
