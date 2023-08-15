import type { ClientClip, ClientMashAsset, Previews, SvgItems } from '@moviemasher/runtime-client'
import type { Size, Time } from '@moviemasher/runtime-shared'

export interface MashPreviewOptions {
  size?: Size
  time?: Time
  selectedClip?: ClientClip
}

export interface MashPreviewArgs {
  selectedClip?: ClientClip
  clip?: ClientClip
  size?: Size
  time: Time
  mash: ClientMashAsset
}

export interface MashPreview extends MashPreviewOptions {
  audible: boolean
  duration: number
  quantize: number
  size: Size
  svgItemsPromise: Promise<SvgItems>
  previewsPromise: Promise<Previews>
  visible: boolean
  mash: ClientMashAsset
  time: Time
}
