import { Size } from "../../Utility/Size"
import { Editor } from "../Editor"
import { Time } from "../../Helpers/Time/Time"
import { Clip } from "../../Edited/Mash/Track/Clip/Clip"
import { Loader } from "../../Loader/Loader"
import { AVType } from "../../Setup/Enums"
import { sortByTrack } from "../../Utility/Sort"
import { TrackPreviewArgs, TrackPreviews } from "./TrackPreview/TrackPreview"
import { TrackPreviewClass } from "./TrackPreview/TrackPreviewClass"
import { Mash } from "../../Edited/Mash/Mash"
import { PreviewArgs, Preview, Svgs, Svg } from "./Preview"
import { svgElement } from "../../Utility/Svg"

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

  selectedClip?: Clip

  streaming = false

  
  get svg(): Promise<Svg> {
    // console.log(this.constructor.name, "svg")
    return this.svgs.then(svgs => {
      const { size, mash } = this
      const { id } = mash
      const svg = svgElement(size)
      svg.append(...svgs.map(svg => svg.element))
      return { element: svg, id  }
    })
  }

  _svgs?: Svgs
  get svgs(): Promise<Svgs> { 
    // console.log(this.constructor.name, "svgs")
    const { _svgs } = this
    if (_svgs) return Promise.resolve(_svgs)

    const { trackPreviews } = this
    const { length } = trackPreviews
    if (!length) return Promise.resolve([])

    const promises = trackPreviews.map(trackPreview => trackPreview.svg)
    const promise = Promise.all(promises)
    return promise.then(svgs => {
      this._svgs = svgs
      return svgs
    })
  } 

  time: Time

  private _trackPreviews?: TrackPreviews
  private get trackPreviews() { return this._trackPreviews ||= this.trackPreviewsInitialize }
  protected get trackPreviewsInitialize(): TrackPreviews {
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
