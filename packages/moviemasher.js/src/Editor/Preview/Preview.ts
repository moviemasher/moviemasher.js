import { Size } from "../../Utility/Size"
import { GraphFileArgs } from "../../MoveMe"
import { Editor } from "../Editor"
import { Time } from "../../Helpers/Time/Time"
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


export interface Svg {
  element: SVGSVGElement
  id: string
}

export type Svgs = Svg[]

export interface Preview extends GraphFileArgs {
  svgs: Svgs
  svg: Svg
  editing: boolean
  editor?: Editor
  size: Size
  selectedClip?: VisibleClip
  time: Time
  duration: number
  audible: boolean
  visible: boolean
  preloader: Loader
}
