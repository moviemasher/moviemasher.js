import { PreviewItems, SvgItems } from "../../../declarations"
import { Size } from "../../../Utility/Size"
import { PreloadOptions } from "../../../MoveMe"
import { Editor } from "../../../Editor/Editor"
import { Time } from "../../../Helpers/Time/Time"
import { Mash } from "../Mash"
import { Clip } from "../Track/Clip/Clip"

export interface PreviewOptions  {
  editor?: Editor
  time?: Time
}

export interface PreviewArgs extends PreviewOptions {
  selectedClip?: Clip
  clip?: Clip
  size?: Size
  time: Time
  mash: Mash
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
