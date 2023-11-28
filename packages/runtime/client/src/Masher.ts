import type { AssetObject, MashAssetObject } from '@moviemasher/runtime-shared'

export interface Masher {
  destroy(): void
  load(data: AssetObject): Promise<void>
  unload(): void
}

export interface ClipLocation {
  index?: number
  track?: number
  frame?: number
}

export interface MasherArgs {
  buffer: number
  fps: number
  loop: boolean
  mash?: MashAssetObject
  patchSvg?: SVGSVGElement
}

export interface MasherOptions extends Partial<MasherArgs> {}

