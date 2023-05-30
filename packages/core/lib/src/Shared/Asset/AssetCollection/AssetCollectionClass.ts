import { DotChar } from '../../../Setup/Constants.js'
import { assertPopulatedString, isArray } from '../../SharedGuards.js'
import { Asset, AssetObject, AssetObjects, Assets } from '../Asset.js'
import { assertAsset, assertAssetObject } from '../AssetGuards.js'
import { AssetCollection } from './AssetCollection.js'
import { AssetType, isAssetType } from '@moviemasher/runtime-shared'
import { MovieMasher } from '@moviemasher/runtime-client'
import { ClientAsset } from "../../../Client/ClientTypes.js"
import { assertAssetType } from '../AssetTypeGuards.js'


export class AssetCollectionClass implements AssetCollection {
  constructor(public eventTarget?: EventTarget) { }

  protected asset(object: AssetObject): Asset {
    throw 'unimplemented'
  }

  private byId = new Map<string, Asset>()

  private byIdAdd(media: Asset | Assets) {
    const mediaArray = Array.isArray(media) ? media : [media]
    mediaArray.forEach(media => {
      console.log(this.constructor.name, 'byIdAdd', media.id, ...this.byId.keys())

      this.byId.set(media.id, media)
    })
  }

  protected byType(type: AssetType): Assets {
    const list = this.mediaArraysByType.get(type)
    if (list) return list

    const assets: Assets = [] //AssetDefaults[type]
    this.mediaArraysByType.set(type, assets)
    return assets
  }

  define(media: AssetObject | AssetObjects): Assets {
    const mediaArray = isArray(media) ? media : [media]

    return mediaArray.map(object => this.fromObject(object))
  }

  private deleteFromArray(media: Asset): void {
    const { type, id } = media
    const mediaArray = this.byType(type)
    const index = mediaArray.findIndex(media => id === media.id)
    // console.log(this.constructor.name, 'definitionDelete', type, id, index)
    if (index < 0)
      return

    mediaArray.splice(index, 1)
  }

  fromId(id: string): Asset {
    // console.log(this.constructor.name, 'fromId', id, this.predefined(id))
    if (this.installed(id)) return this.byId.get(id)!

    const assetType = this.idAssetType(id)
    assertAssetType(assetType, `in AssetCollection.fromId('${id}')`)

    const found = this.byType(assetType).find(media => media.id === id)
    assertAsset(found, id)
    return found
  }

  fromObject(object: AssetObject): Asset {
    assertAssetObject(object)

    const { id } = object
    if (this.installed(id) || this.predefined(id)) return this.fromId(id)

    return this.asset(object)
  }

  get ids(): string[] { return [...this.byId.keys()] }

  install(media: Asset | Assets): Assets {
    const mediaArray = isArray(media) ? media : [media]
    return mediaArray.map(media => {
      const { type, id } = media
      // console.log(this.constructor.name, 'install', media.label)
      if (this.installed(id) || this.predefined(id))
        return this.fromId(id)

      this.byIdAdd(media)
      this.byType(type).push(media)
      return media
    })
  }

  installed(id: string): boolean {
    return this.byId.has(id)
  }


  private mediaArraysByType = new Map<AssetType, Assets>()

  private idAssetType(id: string): AssetType | undefined {
    return id.split(DotChar).find(isAssetType)
  }

  private predefined(id: string) {
    return AssetCollectionClass.predefinedAssets.has(id)

    // // if (id.startsWith(IdPrefix)) return true
    // const mediaType = this.mediaTypeFromId(id)
    // if (!mediaType)
    //   return false

    // const array = this.byType(mediaType)
    // return array.some(media => media.id === id)
  }

  undefineAll() {
    // console.log(this.constructor.name, 'undefineAll')
    // TODO: be more graceful - tell definitions they are being destroyed...
    this.byId = new Map<string, Asset>()
    this.mediaArraysByType = new Map<AssetType, Assets>()
  }

  // private updateDefinition(oldDefinition: Asset, newDefinition: Asset): Asset {
  //   // console.log(this.constructor.name, 'updateDefinition', oldDefinition.type, oldDefinition.id, '->', newDefinition.type, newDefinition.id)
  //   this.uninstall(oldDefinition)
  //   this.install(newDefinition)
  //   return newDefinition
  // }
  updateDefinitionId(oldId: string, newId: string) {
    // console.log(this.constructor.name, 'updateDefinitionId', oldId, '->', newId)
    const media = this.byId.get(oldId)
    assertAsset(media, 'media')

    this.byId.delete(oldId)
    this.byId.set(newId, media)
  }

  private uninstall(media: Asset) {
    this.deleteFromArray(media)
    const { id } = media
    this.byId.delete(id)
    return media
  }

  static predefinedAssets: Map<string, ClientAsset> = new Map()

}
