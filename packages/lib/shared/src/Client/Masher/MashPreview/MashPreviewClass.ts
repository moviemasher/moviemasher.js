import type { Previews, SvgItems } from '@moviemasher/runtime-client'
import type { InstanceCacheArgs, IntrinsicOptions, Size, Time } from '@moviemasher/runtime-shared'
import type { ClientClip, ClientClips, ClientMashAsset } from '@moviemasher/runtime-client'
import type { Masher } from '@moviemasher/runtime-client'
import type { MashPreview, MashPreviewArgs } from './MashPreview.js'
import type { TrackPreviewArgs, TrackPreviews } from './TrackPreview/TrackPreview.js'

import { MovieMasher } from '@moviemasher/runtime-client'
import { PanelPlayer, PanelTimeline } from "../../PanelConstants.js"
import { svgAddClass, svgSvgElement } from '../../SvgFunctions.js'
import { timeRangeFromTime } from '../../../Helpers/Time/TimeUtilities.js'
import { AVTypeVideo } from "../../../Setup/AVTypeConstants.js"
import { EmptyFunction } from "../../../Setup/EmptyFunction.js"
import { sortByTrack } from '../../../Utility/SortFunctions.js'
import { TrackPreviewClass } from './TrackPreview/TrackPreviewClass.js'
import { ClassAnimate, ClassBack, ClassBounds, ClassFore, ClassHandle, ClassLine, ClassOutline, ClassOutlines, ClassTrack } from '../../../Setup/Constants.js'

/**
 * MashPreview of a single mash at a single frame
 */
export class MashPreviewClass implements MashPreview {
  constructor(args: MashPreviewArgs) {
    const { selectedClip, time, mash, clip, size } = args
    this.mash = mash
    this.size = size || mash.size
    this.time = time
    this.selectedClip = selectedClip
    this.clip = clip
  }

  audible = false

  clip?: ClientClip

  private _clips?: ClientClips
  protected get clips() { return this._clips ||= this.clipsInitialize }
  private get clipsInitialize() {
    const { mash, time, clip } = this
    if (clip) return [clip]
    
    return mash.clipsInTimeOfType(time, AVTypeVideo).sort(sortByTrack) 
  }

  combine = false
  
  get duration(): number { return this.time.lengthSeconds }

  get editor(): Masher { return MovieMasher.masher! }

  get intrinsicSizePromise(): Promise<void> {
    const { clips, time, quantize } = this
    const options: IntrinsicOptions = { editing: true, size: true }
    const unknownClips = clips.filter(clip => !clip.intrinsicsKnown(options))

    const args: InstanceCacheArgs = {
      quantize,
      visible: true, time, clipTime: timeRangeFromTime(time)
    }
    const promises = unknownClips.map(clip => {
      args.clipTime = clip.timeRange
      return clip.clipCachePromise(args)
    })

    return Promise.all(promises).then(EmptyFunction)
  }

  mash: ClientMashAsset

  get previewsPromise(): Promise<Previews> { 
    if (this._previews) return Promise.resolve(this._previews)

    const sizePromise = this.intrinsicSizePromise  
    const itemsPromise = sizePromise.then(() => {
      const { clips, size, time, clip } = this
    
      let promise = Promise.resolve([] as Previews)
      const component = clip ? PanelTimeline : PanelPlayer

      clips.forEach(clip => {
        promise = promise.then(lastTuple => {
          return clip.clipPreviewPromise(size, time, component).then(svgItem => {
            return [...lastTuple, svgItem] 
          })
        })
      })
      return promise 
    })
  
    return itemsPromise.then(items => {
      const { clip } = this
      const previews = (!clip && items.length) ? this.previews(items) : items
      return this._previews = previews
    })
  }

  get quantize(): number { return this.mash.quantize }

  size: Size

  selectedClip?: ClientClip

  streaming = false

  private _previews?: Previews
  
  get svgItemsPromise(): Promise<SvgItems> { 
    return this.previewsPromise as Promise<SvgItems>
  }

  time: Time

  private _trackPreviews?: TrackPreviews
  private get trackPreviews() { return this._trackPreviews ||= this.trackPreviewsInitialize }
  protected get trackPreviewsInitialize(): TrackPreviews {
    const trackPreviews: TrackPreviews = []
    const { time, quantize, clips } = this
    const tweenTime = time.isRange ? undefined : time.scale(quantize)
  
    clips.forEach(clip => {
      const clipTimeRange = clip!.timeRange
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

  private previews(items: Previews): Previews {
    if (!items.length) return items
    
    items.forEach(item => svgAddClass(item, ClassTrack))

    const copy = [...items]
    const { size, selectedClip, editor } = this

    const { dragging } = editor
    const { trackPreviews } = this
    const selectedPreview = trackPreviews.find(preview => preview.clip === selectedClip)
    const hoverItems: SvgItems = trackPreviews.map(trackPreview => {
      const trackSelected = trackPreview === selectedPreview
      const classes = [ClassOutline]
      if (!(dragging || trackSelected)) classes.push(ClassAnimate)
      return trackPreview.editingSvgItem(classes)
    })
    const hoversSvg = svgSvgElement(size, hoverItems)
    svgAddClass(hoversSvg, ClassOutlines)

    copy.push(hoversSvg)
    if (!selectedPreview) return copy
    
    const lineClasses = [ClassLine]
    const handleClasses = [ClassHandle]
    const activeSvg = svgSvgElement(size, selectedPreview.svgBoundsElement(lineClasses, handleClasses, true))
    svgAddClass(activeSvg, [ClassBounds, ClassBack])
    
    const passiveSvg = svgSvgElement(size, selectedPreview.svgBoundsElement(lineClasses, handleClasses))
    svgAddClass(passiveSvg, [ClassBounds, ClassFore])
    copy.push(activeSvg, passiveSvg)
    return copy
  }

  visible = true
}

