import { Dimensions } from "../../Setup/Dimensions"
import { GraphFileArgs } from "../../MoveMe"
import { Editor } from "../Editor"
import { Time } from "../../Helpers/Time/Time"
import { Visible } from "../../Mixin/Visible/Visible"
import { Loader } from "../../Loader/Loader"
import { Mash } from "../../Edited/Mash/Mash"
import { VisibleClip } from "../../Media/VisibleClip/VisibleClip"

export interface PreviewOptions  {
  editor?: Editor
  time?: Time
  backcolor?: string
}

export interface PreviewArgs extends PreviewOptions {
  selectedClip?: VisibleClip
  time: Time
  mash: Mash
}

export interface Preview extends GraphFileArgs {
  svgElement: SVGSVGElement
  editing: boolean
  editor?: Editor
  size: Dimensions
  selectedClip?: Visible
  time: Time
  duration: number
  audible: boolean
  visible: boolean
  preloader: Loader
}
