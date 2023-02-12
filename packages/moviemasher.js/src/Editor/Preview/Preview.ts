import { PreviewItems, SvgItems } from "../../Helpers/Svg/Svg"
import { Size } from "../../Utility/Size"
import { PreloadOptions } from "../../Base/Code"
import { Editor } from "../Editor"
import { Time } from "../../Helpers/Time/Time"
import { MashMedia } from "../../Media/Mash/Mash"
import { Clip } from "../../Media/Mash/Track/Clip/Clip"

export interface PreviewOptions  {
  editor?: Editor
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
  editor?: Editor
  quantize: number
  selectedClip?: Clip
  size: Size
  svgItemsPromise: Promise<SvgItems>
  previewItemsPromise: Promise<PreviewItems>
  time: Time
  visible: boolean
}
