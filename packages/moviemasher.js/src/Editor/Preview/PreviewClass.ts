import { Size } from "../../Utility/Size"
import { Editor } from "../Editor"
import { Time } from "../../Helpers/Time/Time"
import { Clip } from "../../Edited/Mash/Track/Clip/Clip"
import { Loader } from "../../Loader/Loader"
import { AVType } from "../../Setup/Enums"
import { sortByTrack } from "../../Utility/Sort"
import { TrackPreview, TrackPreviewArgs, TrackPreviews } from "./TrackPreview/TrackPreview"
import { TrackPreviewClass } from "./TrackPreview/TrackPreviewClass"
import { Mash } from "../../Edited/Mash/Mash"
import { PreviewArgs, Preview } from "./Preview"
import { svgDefsElement, svgDifferenceDefs, svgGroupElement, svgPolygonElement, svgUseElement } from "../../Utility/Svg"
import { isObject } from "../../Utility/Is"
import { idGenerate } from "../../Utility/Id"
import { GraphFileArgs } from "../../MoveMe"
import { SvgItems } from "../../declarations"

export class PreviewClass implements Preview {
  constructor(args: PreviewArgs) {
    const { selectedClip, editor, time, mash, backcolor } = args
    this.mash = mash
    this.size = mash.imageSize
    this.time = time
    this.backcolor = backcolor

    if (isObject(editor)) this.editor = editor
    this.selectedClip = selectedClip
  }

  audible = false

  backcolor?: string

  get editing() { return isObject(this.editor) }
  
  get duration(): number { return this.time.lengthSeconds }

  editor?: Editor

  mash: Mash

  get preloader(): Loader { return this.mash.preloader }

  get quantize(): number { return this.mash.quantize }

  size: Size

  selectedClip?: Clip

  streaming = false

  _svgItems?: SvgItems
  get svgItemsPromise(): Promise<SvgItems> { 
    // console.log(this.constructor.name, "svgs")
    const { _svgItems: _svgs } = this
    if (_svgs) return Promise.resolve(_svgs)

    const { preloader, clips, quantize, time } = this
    const graphFiles = clips.flatMap(clip => {

    const args: GraphFileArgs = { 
      visible: true, editing: true, quantize, time, 
      clipTime: clip.timeRange(quantize), 
    }
      return clip.clipGraphFiles(args)
    })
    const files = graphFiles.filter(file => !preloader.loadedFile(file))
    const promise = preloader.loadFilesPromise(files)
    return promise.then(() => this.svgItems)
  }

  private get svgItems(): SvgItems {
    const svgItems: SvgItems = []
    const { 
      trackPreviews: previews, size, editing, backcolor, selectedClip } = this
    if (!previews.length) return svgItems

    const activeItems: SvgItems = []
    const defItems: SvgItems = []
    const filteredItems: SvgItems = []
    if (backcolor) filteredItems.push(svgPolygonElement(size, '', backcolor))
    const selectedPreview = editing && previews.find(preview => preview.clip === selectedClip)
    
    previews.forEach(trackPreview => {
      const [defs, items] = trackPreview.svgItems
      defItems.push(...defs)
      filteredItems.push(...items)
      if (!editing) return 

      const { clip, editor } = trackPreview
      const { dragging } = editor
      const className = (dragging || selectedClip === clip) ? '' : 'animate'
      const editingItem = trackPreview.editingSvgItem(className)
      activeItems.push(editingItem)
    })
  
    if (editing) {
      if (selectedPreview) {
        const overlayId = idGenerate('overlay')
        defItems.push(selectedPreview.svgBoundsElement(false, overlayId))

        const filteredGroup = svgGroupElement()
        svgItems.push(filteredGroup)
        filteredItems.forEach(item => filteredGroup.appendChild(item))

        const filterElement = svgDifferenceDefs(overlayId, filteredGroup)
        defItems.push(filterElement)

        // mozilla does not support svg fragments in FeImage! 
        // these elements should be styled to be hidden from other browsers
        // and offer an alternative to difference filter
        activeItems.push(svgUseElement(overlayId, `mozilla`))
        
        activeItems.push(selectedPreview.svgBoundsElement(true))
        
      } else svgItems.push(...filteredItems)
      svgItems.push(...activeItems)
    } else svgItems.push(...filteredItems)

    const defsElement = svgDefsElement()
    svgItems.unshift(defsElement)
    defItems.forEach(item => defsElement.appendChild(item))
    return this._svgItems = svgItems
  } 

  time: Time

  private _clips?: Clip[]
  private get clips() { return this._clips ||= this.clipsInitialize }
  private get clipsInitialize() {
    const { mash, time } = this
    return mash.clipsInTimeOfType(time, AVType.Video).sort(sortByTrack) 
  }

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
        clip, preview: this, tweenTime, timeRange
      }
      trackPreviews.push(new TrackPreviewClass(filterChainArgs))
    })
    return trackPreviews
  }

  visible = true
}
