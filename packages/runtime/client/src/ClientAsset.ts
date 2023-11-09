import type { Asset, AssetObject, Size, StringDataOrError } from '@moviemasher/runtime-shared'
import type { Selectable } from './Selectable.js'
import type { ServerProgress } from './ClientEvents.js'

export interface ClientAsset extends Asset, Selectable {
  assetIcon(size: Size, cover?: boolean): Promise<SVGSVGElement> | undefined
  savePromise(progress?: ServerProgress): Promise<StringDataOrError>
  saveNeeded: boolean
}

export interface ClientAssets extends Array<ClientAsset>{}

export interface ClientAssetObject extends AssetObject {}

export interface ClientAssetObjects extends Array<ClientAssetObject>{}
