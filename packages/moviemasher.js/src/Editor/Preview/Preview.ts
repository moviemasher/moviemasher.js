import { Size } from "../../Utility/Size"
import { GraphFileOptions } from "../../MoveMe"
import { Editor } from "../Editor"
import { Time } from "../../Helpers/Time/Time"
import { Loader } from "../../Loader/Loader"
import { Mash } from "../../Edited/Mash/Mash"
import { Clip } from "../../Edited/Mash/Track/Clip/Clip"
import { ScalarObject, SvgItem } from "../../declarations"
import { Rect } from "../../Utility/Rect"

export interface PreviewOptions  {
  editor?: Editor
  time?: Time
  backcolor?: string
}

export interface PreviewArgs extends PreviewOptions {
  selectedClip?: Clip
  time: Time
  mash: Mash
}


export interface Svg {
  element: SvgItem
  id: string
  changeHandler?: (values: ScalarObject) => void 
  clip?: Clip
  rect?: Rect
}

export type Svgs = Svg[]

export interface Preview extends GraphFileOptions {
  svgItemsPromise: Promise<SvgItem[]>
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
