import type { Size, Time } from '@moviemasher/runtime-shared'
import type { ClientClip, ClientMashAsset } from '@moviemasher/runtime-client'
import type { Masher } from '@moviemasher/runtime-client'
import type { Previews, SvgItems } from '@moviemasher/runtime-client'

export interface MashPreviewOptions {
  size?: Size
  time?: Time
}

export interface MashPreviewArgs {
  selectedClip?: ClientClip
  clip?: ClientClip
  size?: Size
  time: Time
  mash: ClientMashAsset
}

export interface MashPreview extends Required<MashPreviewOptions> {
  audible: boolean
  duration: number
  quantize: number
  selectedClip?: ClientClip
  size: Size
  svgItemsPromise: Promise<SvgItems>
  previewsPromise: Promise<Previews>
  visible: boolean
  editor: Masher
  mash: ClientMashAsset
  time: Time
}
