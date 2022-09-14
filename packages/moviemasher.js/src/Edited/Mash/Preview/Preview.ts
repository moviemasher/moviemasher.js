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
  backcolor?: string
}

export interface PreviewArgs extends PreviewOptions {
  selectedClip?: Clip
  onlyClip?: Clip
  size?: Size
  time: Time
  mash: Mash
}

export interface Preview extends GraphFileOptions {
  svgItemsPromise: Promise<SvgItems>
  svgItemPromise: Promise<SvgItem>
  editing: boolean
  editor?: Editor
  size: Size
  selectedClip?: Clip
  time: Time
  duration: number
  audible: boolean
  visible: boolean
  preloader: Loader
  quantize: number
}
