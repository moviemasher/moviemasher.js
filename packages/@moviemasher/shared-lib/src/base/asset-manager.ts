import type { Asset, AssetArgs, AssetManager, AssetObject, AssetObjects, Assets, DataOrError, Identified, Strings } from '../types.js'

import { $COLOR, $DEFAULT, $IMAGE, $JS, $SHAPE, COLON, DEFAULT_CONTAINER_ID, DEFAULT_CONTENT_ID, ERROR, MOVIE_MASHER, assertTuple, errorPromise, isAssetObject, isDefiniteError, namedError } from '../runtime.js'
import { requestUrl } from '../utility/request.js'

export class AssetManagerClass implements AssetManager {
  protected assetsById = new Map<string, Asset>()

  async define(...assetObjects: (AssetObject | Identified)[]): Promise<DataOrError<Assets>> {
    const assets: Assets = []
    for (const assetObject of assetObjects) {
      const existing = this.fromId(assetObject.id)
      if (existing) {
        assets.push(existing)
        continue
      }
      if (!isAssetObject(assetObject)) return errorPromise(ERROR.Syntax)

      const { assets: nestedObjects } = assetObject
      if (nestedObjects?.length) {
        const definedOrError = await this.define(...nestedObjects)
        if (isDefiniteError(definedOrError)) return definedOrError
      }
      const defined = this.fromCall(assetObject)
      if (defined) {
        assets.push(defined)
        continue
      }
      const assetOrError = await this.fromResource(assetObject)
      if (isDefiniteError(assetOrError)) return assetOrError
      const { data: asset } = assetOrError
      assets.push(asset)
    }
    return { data: assets }
  }

  protected fromCall(assetObject: AssetObject): Asset | undefined {
    const args: AssetArgs = { ...assetObject, assetManager: this }
    const { id, source, type } = args
    const assetOrError = MOVIE_MASHER.call<DataOrError<Asset>, AssetArgs>(source, args, type)
    if (isDefiniteError(assetOrError)) return 

    const { data: asset } = assetOrError
    this.assetsById.set(id, asset)
    return asset
  }

  protected fromId(id: string): Asset | undefined {
    const defined = this.assetsById.get(id)
    if (defined) return defined

    if (id === DEFAULT_CONTAINER_ID) {
      return this.fromCall({ id, type: $IMAGE, source: $SHAPE })
    }
    if (id === DEFAULT_CONTENT_ID) {
      return this.fromCall({ id, type: $IMAGE, source: $COLOR })
    }
  }

  protected async fromResource(assetObject: AssetObject): Promise<DataOrError<Asset>> {
    const args: AssetArgs = { ...assetObject, assetManager: this }
    const { id, type, source, resources = [] } = args
    const resource = resources.find(resource => resource.type === $JS)
    if (!resource) return errorPromise(ERROR.Unavailable, id)

    const { request } = resource
    const [moduleId, exportedAs = $DEFAULT] = requestUrl(request).split(COLON)
    const tuple = [moduleId, exportedAs]
    assertTuple<string>(tuple)
    const functionOrError = await MOVIE_MASHER.load<DataOrError<Asset>, AssetArgs>(source, tuple, type)

    if (isDefiniteError(functionOrError)) return functionOrError
  
    const assetOrError = functionOrError.data(args)
    if (isDefiniteError(assetOrError)) return assetOrError
    
    this.assetsById.set(id, assetOrError.data)
    return assetOrError
  }
  
  get(id: string): DataOrError<Asset> {
    const asset = this.fromId(id)
    if (asset) return { data: asset }

    return namedError(ERROR.Unavailable, id)
  }

  undefine(id?: string | Strings | undefined): void {
    throw new Error('Method not implemented.')
  }

  updateDefinitionId(previousId: string, currentId: string): void {}

}