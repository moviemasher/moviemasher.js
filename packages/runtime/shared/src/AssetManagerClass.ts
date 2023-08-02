import type { AssetObject, Asset, Assets } from './AssetTypes.js'
import type { AssetManager, ManageType } from './AssetManagerTypes.js'
import type { AssetType } from './AssetType.js'

import { assertAsset, isAssetObject } from './AssetGuards.js'
import { assertAssetType } from './AssetTypeAsserts.js'
import { isAssetType } from './AssetTypeGuards.js'
import { DotChar } from './DotChar.js'
import { isArray } from './TypeofGuards.js'

export class AssetManagerClass implements AssetManager {

  protected asset(_: string | AssetObject): Asset { throw 'unimplemented' }

  private installedAssetsById = new Map<string, Asset>()

  private setByType(type: AssetType): Assets {
    const assets: Assets = [] 
    this.assetArraysByType.set(type, assets)
    return assets
  }

  protected byType(type: AssetType): Assets {
    return this.assetArraysByType.get(type) || this.setByType(type) 
  }

  declare protected context: string

  define(assetIdOrObject: string | AssetObject, manageType?: ManageType): Asset {
    const id = isAssetObject(assetIdOrObject) ? assetIdOrObject.id : assetIdOrObject
    if (this.installed(id)) return this.fromId(id)

    return this.asset(assetIdOrObject)
  }

  fromId(id: string): Asset {
    if (this.installed(id)) return this.installedAssetsById.get(id)!

    if (this.predefined(id)) return this.predefinedAssetsById.get(id)!

    const assetType = this.idAssetType(id)
    assertAssetType(assetType)

    const found = this.byType(assetType).find(media => media.id === id)
    assertAsset(found, id)
    return found
  }

  get ids(): string[] { return [...this.installedAssetsById.keys()] }

  install(media: Asset | Assets): Assets {
    const mediaArray = isArray(media) ? media : [media]
    return mediaArray.map(media => {
      const { type, id } = media
      if (this.installed(id) || this.predefined(id)) return this.fromId(id)

      this.installedAssetsById.set(media.id, media)
    
      this.byType(type).push(media)
      return media
    })
  }

  installed(id: string): boolean {
    return this.installedAssetsById.has(id)
  }

  private assetArraysByType = new Map<AssetType, Assets>()

  private idAssetType(id: string): AssetType | undefined {
    return id.split(DotChar).find(isAssetType)
  }

  predefine(id: string, asset: Asset): void {
    this.predefinedAssetsById.set(id, asset)
  }

  private predefined(id: string) {
    return this.predefinedAssetsById.has(id)
  }

  undefine(manageType?: ManageType) {
    // TODO: be more graceful - tell definitions they are being destroyed...
    this.installedAssetsById = new Map<string, Asset>()
    this.assetArraysByType = new Map<AssetType, Assets>()
  }

  updateDefinitionId(oldId: string, newId: string) {
    // console.log(this.constructor.name, 'updateDefinitionId', oldId, '->', newId)
    const media = this.installedAssetsById.get(oldId)
    assertAsset(media, 'media')

    this.installedAssetsById.delete(oldId)
    this.installedAssetsById.set(newId, media)
  }

  private predefinedAssetsById: Map<string, Asset> = new Map()
}

export const ManageTypeBrowse: ManageType = 'browse'
