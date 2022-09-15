import { Size } from "../../../Utility/Size"
import { GraphFileOptions } from "../../../MoveMe"
import { Editor } from "../../../Editor/Editor"
import { Time } from "../../../Helpers/Time/Time"
import { Loader } from "../../../Loader/Loader"
import { Mash } from "../Mash"
import { Clip } from "../Track/Clip/Clip"
import { SvgItem, SvgItems } from "../../../declarations"

export interface PreviewOptions  {
  editor?: Editor
  time?: Time
  background?: string
}

export interface PreviewArgs extends PreviewOptions {
  selectedClip?: Clip
  onlyClip?: Clip
  size?: Size
  time: Time
  mash: Mash
}

export interface Preview extends GraphFileOptions {
  audible: boolean
  duration: number
  editing: boolean
  editor?: Editor
  preloader: Loader
  quantize: number
  selectedClip?: Clip
  size: Size
  svgItemPromise: Promise<SvgItem>
  svgItemsPromise: Promise<SvgItems>
  time: Time
  visible: boolean
}
