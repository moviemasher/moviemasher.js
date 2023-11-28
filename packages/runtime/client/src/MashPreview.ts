
import type { Size, Time } from '@moviemasher/runtime-shared'
import type { ClientClip, ClientMashAsset } from './ClientMashTypes.js'
import type { PreviewElements, SvgItems } from './Svg.js'

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
  previewsPromise: Promise<PreviewElements>
  visible: boolean
  mash: ClientMashAsset
  time: Time
}
