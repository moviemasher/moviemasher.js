import type { Size, Time } from '@moviemasher/runtime-shared'
import type { ClientClip, ClientMashAsset } from '../../../Client/Mash/ClientMashTypes.js'
import type { Masher } from '../Masher.js'
import type { PreviewItems, SvgItems } from '../../../Helpers/Svg/Svg.js'

export interface PreviewOptions {
  time?: Time
}

export interface PreviewArgs extends Required<PreviewOptions> {
  selectedClip?: ClientClip
  clip?: ClientClip
  size?: Size
  mash: ClientMashAsset
}

export interface Preview extends Required<PreviewOptions> {
  audible: boolean
  duration: number
  quantize: number
  selectedClip?: ClientClip
  size: Size
  svgItemsPromise: Promise<SvgItems>
  previewItemsPromise: Promise<PreviewItems>
  visible: boolean
  editor: Masher
}
