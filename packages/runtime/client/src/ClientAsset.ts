import type { Asset } from '@moviemasher/runtime-shared'
import type { Size } from '@moviemasher/runtime-shared'
import type { Selectable } from './Selectable.js'



export interface ClientAsset extends Asset, Selectable {
  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined
}

export type ClientAssets = ClientAsset[]
