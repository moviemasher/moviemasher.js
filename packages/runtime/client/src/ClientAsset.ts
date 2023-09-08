import type { Asset, AssetObject, Size, StringDataOrError } from '@moviemasher/runtime-shared'
import type { Selectable } from './Selectable.js'
import type { ServerProgress } from './ClientEvents.js'

export interface ClientAsset extends Asset, Selectable {
  assetIcon(size: Size, cover?: boolean): Promise<SVGSVGElement> | undefined
  savePromise(progress?: ServerProgress): Promise<StringDataOrError>
  saveNeeded: boolean
}

export type ClientAssets = ClientAsset[]

export interface ClientAssetObject extends AssetObject {}

export type ClientAssetObjects = ClientAssetObject[]
