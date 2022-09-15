import { assertSizeAboveZero, Size } from "../../../Utility/Size"
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
import { svgDefsElement, svgDifferenceDefs, svgElement, svgGroupElement, svgPolygonElement, svgUseElement } from "../../../Utility/Svg"
import { assertObject, isObject } from "../../../Utility/Is"
import { idGenerate } from "../../../Utility/Id"
import { GraphFiles } from "../../../MoveMe"
import { SvgItem, SvgItems, SvgItemsTuple } from "../../../declarations"
import { EmptyMethod } from "../../../Setup/Constants"

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

  mash: Mash

  onlyClip?: Clip

  get preloader(): Loader { return this.mash.preloader }


  get quantize(): number { return this.mash.quantize }

  size: Size

  selectedClip?: Clip

  streaming = false


  private _svgItems?: SvgItems
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

  
  get svgItemPromise(): Promise<SvgItem> { 
    return this.svgItemsPromise.then(svgItems => {
      const { length } = svgItems
      if (length === 1) return svgItems[0]
      
      const { size } = this
      const element = svgElement(size)
      svgItems.forEach(item => element.appendChild(item))
      return element
    })
  }
  get svgItemsPromise(): Promise<SvgItems> { 
    if (this._svgItems) return Promise.resolve(this._svgItems)

    const sizePromise = this.intrinsicSizePromise
    const itemsPromise = sizePromise.then(() => this.itemsPromise)
    return itemsPromise.then(tuple => {
      return this._svgItems = this.tupleItems(tuple)
    })
  }

  private tupleItems(tuple: SvgItemsTuple): SvgItems {
    const [defItems, previewItems] = tuple
    const { clips, size, editing, background, selectedClip, editor } = this
    if (background) previewItems.unshift(svgPolygonElement(size, '', background))
    if (!clips.length) return previewItems

    if (!editing) {
      // console.log("PreviewClass NOT EDITING")
      return [svgDefsElement(defItems), ...previewItems]
    }

    assertObject(editor)

    const { dragging } = editor
    const {trackPreviews: previews} = this
    const overlayId = idGenerate('overlay')
    const selected = previews.find(preview => preview.clip === selectedClip)
    const hoverItems: SvgItems = previews.map(trackPreview => {
      const trackSelected = trackPreview === selected
      const className = (dragging || trackSelected) ? '' : 'animate'
      return trackPreview.editingSvgItem(className)
    })
    if (!selected) {
      // console.log("PreviewClass NO SELECTION")
      return [svgDefsElement(defItems), ...previewItems, ...hoverItems]
    }
    // console.log("PreviewClass SELECTION")

    const filteredGroup = svgGroupElement()
    previewItems.forEach(item => filteredGroup.appendChild(item))
    const filterElement = svgDifferenceDefs(overlayId, filteredGroup)
 
    return [
      svgDefsElement([
        selected.svgBoundsElement(false, overlayId), 
        ...defItems, 
        filterElement
      ]), 
      filteredGroup, 
      ...hoverItems,
      // mozilla does not support svg fragments in FeImage! 
      // these elements should be styled to be hidden from other browsers
      // and offer an alternative to difference filter
      svgUseElement(overlayId, `mozilla`),
      selected.svgBoundsElement(true),
    ]
  }

  private get itemsPromise(): Promise<SvgItemsTuple> {
    const { clips, size, time, onlyClip } = this
    
    let promise = Promise.resolve([[], []] as SvgItemsTuple)
    const icon = !!onlyClip
    clips.forEach(clip => {
      promise = promise.then(lastTuple => {
        return clip.previewItemsPromise(size, time, icon).then(clipTuple => {
          const [lastDefs, lastItems] = lastTuple
          const [clipDefs, clipItems] = clipTuple
          return [[...lastDefs, ...clipDefs], [...lastItems, ...clipItems]] 
        })
      })
    })
    return promise 
  }

  visible = true
}

