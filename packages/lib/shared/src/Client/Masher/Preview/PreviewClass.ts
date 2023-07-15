import type { PreviewItems, SvgItems } from '@moviemasher/runtime-client'
import type { InstanceCacheArgs, IntrinsicOptions, Size, Time } from '@moviemasher/runtime-shared'
import type { ClientClip, ClientClips, ClientMashAsset } from '@moviemasher/runtime-client'
import type { Masher } from '@moviemasher/runtime-client'
import type { Preview, PreviewArgs } from './Preview.js'
import type { TrackPreviewArgs, TrackPreviews } from './TrackPreview/TrackPreview.js'

import { MovieMasher } from '@moviemasher/runtime-client'
import { PanelPlayer, PanelTimeline } from "../../PanelConstants.js"
import { svgAddClass, svgSvgElement } from '../../SvgFunctions.js'
import { timeRangeFromTime } from '../../../Helpers/Time/TimeUtilities.js'
import { AVTypeVideo } from "../../../Setup/AVTypeConstants.js"
import { EmptyFunction } from "../../../Setup/EmptyFunction.js"
import { sortByTrack } from '../../../Utility/SortFunctions.js'
import { TrackPreviewClass } from './TrackPreview/TrackPreviewClass.js'

/**
 * Preview of a single mash at a single frame
 */
export class PreviewClass implements Preview {
  constructor(args: PreviewArgs) {
    const { selectedClip, time, mash, clip, size } = args
    this.mash = mash
    this.size = size || mash.imageSize
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

  get previewItemsPromise(): Promise<PreviewItems> { 
    if (this._svgItems) return Promise.resolve(this._svgItems)

    const sizePromise = this.intrinsicSizePromise  
    const itemsPromise = sizePromise.then(() => {
      const { clips, size, time, clip } = this
    
      let promise = Promise.resolve([] as PreviewItems)
      const component = clip ? PanelTimeline : PanelPlayer

      clips.forEach(clip => {
        promise = promise.then(lastTuple => {
          return clip.clipPreviewItemsPromise(size, time, component).then(svgItem => {
            return [...lastTuple, svgItem] 
          })
        })
      })
      return promise 
    })
  
    return itemsPromise.then(svgItems => {
      const { clip } = this
      const items = (!clip && svgItems.length) ? this.tupleItems(svgItems) : svgItems
      return this._svgItems = items
    })
  }

  get quantize(): number { return this.mash.quantize }

  size: Size

  selectedClip?: ClientClip

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

  private tupleItems(svgItems: PreviewItems): PreviewItems {
    const { size, selectedClip, editor } = this
    // console.log(this.constructor.name, 'tupleItems', !!selectedClip)
    const items = [...svgItems]

    const trackClasses = 'track'
    items.forEach(item => svgAddClass(item, trackClasses))

    if (!svgItems.length) return items


    // TODO: get classes from theme

    const { dragging } = editor
    const { trackPreviews } = this
    const selectedPreview = trackPreviews.find(preview => preview.clip === selectedClip)
    const hoverItems: SvgItems = trackPreviews.map(trackPreview => {
      const trackSelected = trackPreview === selectedPreview
      const classes = ['outline']
      if (!(dragging || trackSelected)) classes.push('animate')
      // console.log(this.constructor.name, 'tupleItems', dragging, trackSelected)
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

