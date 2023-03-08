import { Size } from "../../../Utility/Size"
import { Masher } from "../Masher"
import { Time } from "../../../Helpers/Time/Time"
import { Clip, IntrinsicOptions } from "../../../Media/Mash/Track/Clip/Clip"
import { AVType } from "../../../Setup/Enums"
import { sortByTrack } from "../../../Utility/Sort"
import { TrackPreviewArgs, TrackPreviews } from "./TrackPreview/TrackPreview"
import { TrackPreviewClass } from "./TrackPreview/TrackPreviewClass"
import { MashMedia } from "../../../Media/Mash/Mash"
import { PreviewArgs, Preview } from "./Preview"
import { svgAddClass, svgSvgElement } from "../../../Helpers/Svg/SvgFunctions"
import { assertObject, isObject } from "../../../Utility/Is"
import { Component, PreloadArgs } from "../../../Base/Code"
import { PreviewItems, SvgItems } from "../../../Helpers/Svg/Svg"
import { timeRangeFromTime } from "../../../Helpers/Time/TimeUtilities"
import { EmptyFunction } from "../../../Setup/Constants"

/**
 * Preview of a single mash at a single frame
 */
export class PreviewClass implements Preview {
  constructor(args: PreviewArgs) {
    const { selectedClip, editor, time, mash, clip, size } = args
    this.mash = mash
    this.size = size || mash.imageSize
    this.time = time
    this.selectedClip = selectedClip
    this.clip = clip

    if (isObject(editor)) this.editor = editor
  }

  audible = false

  clip?: Clip

  private _clips?: Clip[]
  protected get clips() { return this._clips ||= this.clipsInitialize }
  private get clipsInitialize() {
    const { mash, time, clip } = this
    if (clip) return [clip]
    
    return mash.clipsInTimeOfType(time, AVType.Video).sort(sortByTrack) 
  }


  combine = false
  
  get duration(): number { return this.time.lengthSeconds }

  get editing() { return isObject(this.editor) }

  editor?: Masher

  get intrinsicSizePromise(): Promise<void> {
    const { clips, time, quantize } = this
    const options: IntrinsicOptions = { editing: true, size: true }
    const unknownClips = clips.filter(clip => !clip.intrinsicsKnown(options))

    const args: PreloadArgs = {
      quantize,
      editing: true, visible: true, time, clipTime: timeRangeFromTime(time)
    }
    const promises = unknownClips.map(clip => {
      args.clipTime = clip.timeRange(quantize)
      return clip.loadPromise(args)
    })

    return Promise.all(promises).then(EmptyFunction)
  }

  mash: MashMedia

  get previewItemsPromise(): Promise<PreviewItems> { 
    if (this._svgItems) return Promise.resolve(this._svgItems)

    const sizePromise = this.intrinsicSizePromise  
    const itemsPromise = sizePromise.then(() => {
      const { clips, size, time, clip } = this
    
      let promise = Promise.resolve([] as PreviewItems)
      const component = clip ? Component.Timeline : Component.Player

      clips.forEach(clip => {
        promise = promise.then(lastTuple => {
          return clip.previewItemsPromise(size, time, component).then(svgItems => {
            return [...lastTuple, ...svgItems] 
          })
        })
      })
      return promise 
    })
  
    return itemsPromise.then(svgItems => {
      return this._svgItems = svgItems.length ? this.tupleItems(svgItems) : []
    })
  }

  get quantize(): number { return this.mash.quantize }

  size: Size

  selectedClip?: Clip

  streaming = false

  private _svgItems?: PreviewItems
  
  get svgItemsPromise(): Promise<SvgItems> { 
    return this.previewItemsPromise as Promise<SvgItems>
  }

  time: Time

  private _trackPreviews?: TrackPreviews
  private get trackPreviews() { return this._trackPreviews ||= this.trackPreviewsInitialize }
  protected get trackPreviewsInitialize(): TrackPreviews {
    const trackPreviews: TrackPreviews = []
    const { time, quantize, clips } = this
    const tweenTime = time.isRange ? undefined : time.scale(quantize)
  
    clips.forEach(clip => {
      const clipTimeRange = clip!.timeRange(quantize)
      const range = clipTimeRange.scale(time.fps)
      const frame = Math.max(0, time.frame - range.frame)
      const timeRange = range.withFrame(frame)
      const filterChainArgs: TrackPreviewArgs = {
        clip, preview: this, tweenTime, timeRange, icon: !!this.clip
      }
      trackPreviews.push(new TrackPreviewClass(filterChainArgs))
    })
    return trackPreviews
  }

  private tupleItems(svgItems: PreviewItems): PreviewItems {
    const { size, editing, selectedClip, editor } = this
    const items = [...svgItems]

    const trackClasses = 'track'
    items.forEach(item => svgAddClass(item, trackClasses))

    if (!(editing && svgItems.length)) return items

    assertObject(editor, 'editor')

    // TODO: get classes from theme

    const { dragging } = editor
    const { trackPreviews } = this
    const selectedPreview = trackPreviews.find(preview => preview.clip === selectedClip)
    const hoverItems: SvgItems = trackPreviews.map(trackPreview => {
      const trackSelected = trackPreview === selectedPreview
      const classes = ['outline']
      if (!(dragging || trackSelected)) classes.push('animate')
      // console.log(this.constructor.name, "tupleItems", dragging, trackSelected)
      return trackPreview.editingSvgItem(classes)
    })
    const outlineClasses = ['outlines']
    const hoversSvg = svgSvgElement(size, hoverItems)
    svgAddClass(hoversSvg, outlineClasses)

    items.push(hoversSvg)
    if (!selectedPreview) return items
    
    const classes = ['bounds', 'back']
    const lineClasses = ['line']
    const handleClasses = ['handle']
    const activeSvg = svgSvgElement(size, selectedPreview.svgBoundsElement(lineClasses, handleClasses, true))
    svgAddClass(activeSvg, classes)
    classes[1] = 'fore'
    const passiveSvg = svgSvgElement(size, selectedPreview.svgBoundsElement(lineClasses, handleClasses))
    svgAddClass(passiveSvg, classes)
    items.push(activeSvg, passiveSvg)
    return items
  }

  visible = true
}

