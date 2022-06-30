import { Point, SvgContents } from "../../declarations"
import { Dimensions } from "../../Setup/Dimensions"
import { Editor } from "../Editor"
import { Time } from "../../Helpers/Time/Time"
import { VisibleClip } from "../../Media/VisibleClip/VisibleClip"
import { Loader } from "../../Loader/Loader"
import { NamespaceSvg } from "../../Setup/Constants"
import { AVType } from "../../Setup/Enums"
import { sortByTrack } from "../../Utility/Sort"
import { TrackPreviewArgs, TrackPreviews } from "./TrackPreview/TrackPreview"
import { TrackPreviewClass } from "./TrackPreview/TrackPreviewClass"
import { Mash } from "../../Edited/Mash/Mash"
import { PreviewArgs, Preview } from "./Preview"

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
  size: Dimensions

  selectedClip?: VisibleClip

  selectedScale: Point = { x: 0, y: 0 }

  streaming = false

  get svgElement(): SVGSVGElement {
    const { trackPreviews, size, backcolor } = this
    const contents: SvgContents = []
    if (backcolor) {
      const rectElement = globalThis.document.createElementNS(NamespaceSvg, 'rect')
      rectElement.setAttribute('width', String(size.width))
      rectElement.setAttribute('height', String(size.height))
      rectElement.setAttribute('fill', backcolor)
      contents.push(rectElement)
    }
    // console.log(this.constructor.name, "svgElement", trackPreviews.length)
    contents.push(...trackPreviews.map(chain => chain.svg))
    const width = String(size.width)
    const height = String(size.height)

    const svgElement = globalThis.document.createElementNS(NamespaceSvg, 'svg')
    svgElement.setAttribute('width', width)
    svgElement.setAttribute('height', height)
    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svgElement.append(...contents)
    return svgElement
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
