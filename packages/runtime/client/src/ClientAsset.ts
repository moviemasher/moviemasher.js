import type { Asset, AssetObject, Size, StringDataOrError, TranscodingTypes } from '@moviemasher/runtime-shared'
import type { Selectable } from './Selectable.js'
import type { Transcoding, TranscodingObjects, Transcodings } from './Transcoding.js'

export interface ClientAsset extends Asset, Selectable {
  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined
  savePromise: Promise<StringDataOrError>
  saveNeeded: boolean
}

export type ClientAssets = ClientAsset[]

export interface ClientAssetObject extends AssetObject {}
