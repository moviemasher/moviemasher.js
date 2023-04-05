import {PreviewItems, SvgItems} from '../../../Helpers/Svg/Svg.js'
import {Size} from '../../../Utility/Size.js'
import {PreloadOptions} from '../../../Base/Code.js'
import {Masher} from '../Masher.js'
import {Time} from '../../../Helpers/Time/Time.js'
import {MashMedia} from '../../../Media/Mash/Mash.js'
import {Clip} from '../../../Media/Mash/Track/Clip/Clip.js'

export interface PreviewOptions  {
  editor?: Masher
  time?: Time
}

export interface PreviewArgs extends PreviewOptions {
  selectedClip?: Clip
  clip?: Clip
  size?: Size
  time: Time
  mash: MashMedia
}

export interface Preview extends PreloadOptions {
  audible: boolean
  duration: number
  editing: boolean
  editor?: Masher
  quantize: number
  selectedClip?: Clip
  size: Size
  svgItemsPromise: Promise<SvgItems>
  previewItemsPromise: Promise<PreviewItems>
  time: Time
  visible: boolean
}
