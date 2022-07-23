import { SvgContents } from "../../declarations"
import { Size } from "../../Utility/Size"
import { Editor } from "../Editor"
import { Time } from "../../Helpers/Time/Time"
import { VisibleClip } from "../../Media/VisibleClip/VisibleClip"
import { Loader } from "../../Loader/Loader"
import { AVType } from "../../Setup/Enums"
import { sortByTrack } from "../../Utility/Sort"
import { TrackPreviewArgs, TrackPreviews } from "./TrackPreview/TrackPreview"
import { TrackPreviewClass } from "./TrackPreview/TrackPreviewClass"
import { Mash } from "../../Edited/Mash/Mash"
import { PreviewArgs, Preview, Svgs, Svg } from "./Preview"
import { svgElement, svgPolygonElement } from "../../Utility/Svg"

export class PreviewClass implements Preview {
  constructor(args: PreviewArgs) {
    const { selectedClip, editor, time, mash, backcolor } = args
    this.mash = mash
    this.size = mash.imageSize
    this.time = time
    this.backcolor = backcolor
    if (editor) this.editor = editor
    this.selectedClip = selectedClip
  }

  audible = false

  backcolor?: string

  editing = true
  
  get duration(): number { return this.time.lengthSeconds }

  editor?: Editor

  mash: Mash

  get preloader(): Loader { return this.mash.preloader }

  get quantize(): number { return this.mash.quantize }

  size: Size

  selectedClip?: VisibleClip

  streaming = false

  // get svgElement(): SVGSVGElement {
  //   const { trackPreviews, size, backcolor } = this
  //   const contents: SvgContents = []
  //   if (backcolor) contents.push(svgPolygonElement(size, '', backcolor))
  //   contents.push(...trackPreviews.map(chain => chain.svgElement))
  //   const element = svgElement(size)
  //   element.append(...contents)
  //   return element
  // }

  _svgs?: Svgs
  get svgs(): Svgs { 
    return this._svgs ||= this.trackPreviews.map(preview => preview.svg)
  } 
  
  get svg(): Svg {
    const { size, svgs, mash } = this
    const { id } = mash
    const svg = svgElement(size)
    svg.append(...svgs.map(svg => svg.element))
    return { element: svg, id  }
  }

  time: Time

  private _trackPreviews?: TrackPreviews
  private get trackPreviews() { return this._trackPreviews ||= this.trackPreviewsInitialize }
  private get trackPreviewsInitialize(): TrackPreviews {
    const trackPreviews: TrackPreviews = []
    const { time, quantize } = this

    const tweenTime = time.isRange ? undefined : time.scale(quantize)
    const clips = this.mash.clipsInTimeOfType(time, AVType.Video).sort(sortByTrack)

    clips.forEach(clip => {
      const clipTimeRange = clip!.timeRange(quantize)
      const range = clipTimeRange.scale(time.fps)
      const frame = Math.max(0, time.frame - range.frame)
      const timeRange = range.withFrame(frame)
      const filterChainArgs: TrackPreviewArgs = {
        clip, preview: this, tweenTime, timeRange
      }
      trackPreviews.push(new TrackPreviewClass(filterChainArgs))
    })
    return trackPreviews
  }

  visible = true
}
