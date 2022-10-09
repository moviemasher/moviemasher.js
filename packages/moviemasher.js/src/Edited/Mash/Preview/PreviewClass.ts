import { Size } from "../../../Utility/Size"
import { Editor } from "../../../Editor/Editor"
import { Time } from "../../../Helpers/Time/Time"
import { Clip, IntrinsicOptions } from "../Track/Clip/Clip"
import { Loader } from "../../../Loader/Loader"
import { AVType } from "../../../Setup/Enums"
import { sortByTrack } from "../../../Utility/Sort"
import { TrackPreviewArgs, TrackPreviews } from "./TrackPreview/TrackPreview"
import { TrackPreviewClass } from "./TrackPreview/TrackPreviewClass"
import { Mash } from "../Mash"
import { PreviewArgs, Preview } from "./Preview"
import { svgAddClass, svgAppend, svgDefsElement, svgDifferenceDefs, svgElement, svgGroupElement, svgPolygonElement, svgSet, svgUseElement } from "../../../Utility/Svg"
import { assertObject, isObject } from "../../../Utility/Is"
import { idGenerate } from "../../../Utility/Id"
import { GraphFiles } from "../../../MoveMe"
import { PreviewItems, SvgItem, SvgItems, SvgItemsTuple } from "../../../declarations"

export class PreviewClass implements Preview {
  constructor(args: PreviewArgs) {
    const { selectedClip, editor, time, mash, background, onlyClip, size } = args
    this.mash = mash
    this.size = size || mash.imageSize
    this.time = time
    this.background = background
    this.selectedClip = selectedClip
    this.onlyClip = onlyClip

    if (isObject(editor)) this.editor = editor
  }


  audible = false

  background?: string

  private _clips?: Clip[]
  protected get clips() { return this._clips ||= this.clipsInitialize }
  private get clipsInitialize() {
    const { mash, time, onlyClip } = this
    if (onlyClip) return [onlyClip]
    
    return mash.clipsInTimeOfType(time, AVType.Video).sort(sortByTrack) 
  }

  combine = false
  
  get duration(): number { return this.time.lengthSeconds }

  get editing() { return isObject(this.editor) }

  editor?: Editor

  get intrinsicSizePromise(): Promise<void> {
    const { clips, preloader } = this
    const options: IntrinsicOptions = { editing: true, size: true }
    const unknownClips = clips.filter(clip => !clip.intrinsicsKnown(options))
    const files: GraphFiles = unknownClips.flatMap(clip => 
      clip.intrinsicGraphFiles(options)
    )
    return preloader.loadFilesPromise(files)
  }

  private get itemsPromise(): Promise<PreviewItems> {
    const { clips, size, time, onlyClip } = this
    
    let promise = Promise.resolve([] as PreviewItems)
    const icon = !!onlyClip
    clips.forEach(clip => {
      promise = promise.then(lastTuple => {
        return clip.previewItemsPromise(size, time, icon).then(svgItems => {
          return [...lastTuple, ...svgItems] 
        })
      })
    })
    return promise 
  }

  mash: Mash

  onlyClip?: Clip

  get preloader(): Loader { return this.mash.preloader }

  get quantize(): number { return this.mash.quantize }

  size: Size

  selectedClip?: Clip

  streaming = false


  private _svgItems?: PreviewItems
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
        clip, preview: this, tweenTime, timeRange, icon: !!this.onlyClip
      }
      trackPreviews.push(new TrackPreviewClass(filterChainArgs))
    })
    return trackPreviews
  }
  get svgItemsPromise(): Promise<SvgItems> { 
    return this.previewItemsPromise as Promise<SvgItems>
  }

  

  get previewItemsPromise(): Promise<PreviewItems> { 
    if (this._svgItems) return Promise.resolve(this._svgItems)

    const sizePromise = this.intrinsicSizePromise  
    const itemsPromise = sizePromise.then(() => this.itemsPromise)
  
    return itemsPromise.then(svgItems => {
      return this._svgItems = this.tupleItems(svgItems)
    })
  }

  private tupleItems(svgItems: PreviewItems): PreviewItems {
    const { size, editing, background, selectedClip, editor } = this
    const previewItems = [...svgItems]
    const trackClasses = 'track'
    previewItems.forEach(item => svgAddClass(item, trackClasses))
    const backgroundClasses = 'background'
    if (background) {
      const backgroundPolygon = svgPolygonElement(size, backgroundClasses, background)
      const backgroundSvg = svgElement(size, backgroundPolygon)
      previewItems.unshift(backgroundSvg)
    }
    if (!(editing && svgItems.length)) return previewItems

    assertObject(editor)

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
    const hoversSvg = svgElement(size, hoverItems)
    svgAddClass(hoversSvg, outlineClasses)

    previewItems.push(hoversSvg)
    if (!selectedPreview) return previewItems
    
    const classes = ['bounds', 'back']
    const lineClasses = ['line']
    const handleClasses = ['handle']
    const activeSvg = svgElement(size, selectedPreview.svgBoundsElement(lineClasses, handleClasses, true))
    svgAddClass(activeSvg, classes)
    classes[1] = 'fore'
    const passiveSvg = svgElement(size, selectedPreview.svgBoundsElement(lineClasses, handleClasses))
    svgAddClass(passiveSvg, classes)
    previewItems.push(activeSvg, passiveSvg)
    return previewItems
  }
  visible = true
}

