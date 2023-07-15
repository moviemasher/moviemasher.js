import type { Sizing, Time, TimeRange, Timing } from '@moviemasher/runtime-shared'


import type { SelectorType } from "@moviemasher/runtime-client"
import type {Clip, IntrinsicOptions} from '@moviemasher/runtime-shared'
import type { ClipObject } from '@moviemasher/runtime-shared'
import type { ContainerRectArgs} from '@moviemasher/runtime-shared'

import {Rect, RectTuple} from '@moviemasher/runtime-shared'
import type {Scalar, Strings, UnknownRecord} from '@moviemasher/runtime-shared'
import type {Track} from '@moviemasher/runtime-shared'

import type { Size } from '@moviemasher/runtime-shared'
import { Property } from '@moviemasher/runtime-shared'
import { DataGroupTiming } from '../../../Setup/DataGroupConstants.js'

import { TypeClip } from '../../../Setup/TypeConstants.js'
import {
  SizingContent, Sizings,
  SizingContainer, SizingPreview
} from '../../../Setup/SizingConstants.js'
import { Timings, TimingContainer, TimingCustom, TimingContent } from '../../../Setup/TimingConstants.js'
import { DurationUnknown, DurationNone } from '../../../Setup/DurationConstants.js'
import { DataTypeContainerId, DataTypeContentId, DataTypeFrame, DataTypeOption, DataTypeString } from '../../../Setup/DataTypeConstants.js'
import {assertAboveZero, assertDefined, assertPopulatedString, assertPositive, assertTrue, isAboveZero} from '../../SharedGuards.js'
import { isPopulatedString, isUndefined } from "@moviemasher/runtime-shared"
import {assertContainerInstance, isContainerInstance} from '../../../Helpers/Container/ContainerGuards.js'
import {assertContentInstance, isContentInstance} from '../../../Helpers/Content/ContentGuards.js'
import { propertyInstance } from '../../../Setup/PropertyFunctions.js'
import {Default} from '../../../Setup/Default.js'
import {DefaultContainerId} from '../../../Helpers/Container/ContainerConstants.js'
import {DefaultContentId} from '../../../Helpers/Content/ContentConstants.js'
import {idGenerateString} from '../../../Utility/IdFunctions.js'
import { PointZero } from '../../../Utility/PointConstants.js'
import { PropertiedClass } from '../../../Base/PropertiedClass.js'
import {timeFromArgs, timeRangeFromArgs} from '../../../Helpers/Time/TimeUtilities.js'
import { Instance, InstanceObject, VisibleInstance, VisibleInstanceObject } from '@moviemasher/runtime-shared'
import { InstanceCacheArgs } from "@moviemasher/runtime-shared"
import { EmptyFunction } from '../../../Setup/EmptyFunction.js'
import { MovieMasher } from '@moviemasher/runtime-client'

export class ClipClass extends PropertiedClass implements Clip {
  constructor(object: ClipObject) {
    const { containerId, contentId, sizing, timing } = object
    // console.log('ClipClass', object)
    const defaultContent = isUndefined(contentId) || contentId === DefaultContentId
    const defaultContainer = isUndefined(containerId) || containerId === DefaultContainerId
    if (defaultContent && !sizing) {
      // console.log('instanceArgs setting sizing to container', object)
      object.sizing = SizingContainer
    }
    if (defaultContainer && !sizing) {
      // console.log('instanceArgs setting sizing to preview', object)
      object.sizing = SizingPreview
    }
    if (defaultContent && !timing) {
      object.timing = TimingContainer
    }
    if (defaultContainer && !timing) {
      object.timing = TimingCustom
    }

    super(object)

    this.properties.push(propertyInstance({
      name: 'containerId', type: DataTypeContainerId,
      defaultValue: DefaultContainerId
    }))
    this.properties.push(propertyInstance({
      name: 'contentId', type: DataTypeContentId,
      defaultValue: DefaultContentId
    }))
    this.properties.push(propertyInstance({ 
      name: 'label', type: DataTypeString 
    }))
    this.properties.push(propertyInstance({ 
      name: 'sizing', type: DataTypeOption, defaultValue: SizingContent,
      options: Sizings,
    }))
    this.properties.push(propertyInstance({ 
      name: 'timing', type: DataTypeOption, defaultValue: TimingContent,
      group: DataGroupTiming, options: Timings
    }))
    this.properties.push(propertyInstance({ 
      name: 'frame',
      type: DataTypeFrame, 
      group: DataGroupTiming, 
      defaultValue: DurationNone, min: 0, step: 1
    }))
    this.properties.push(propertyInstance({ 
      name: 'frames', type: DataTypeFrame, defaultValue: DurationUnknown,
      min: 1, step: 1,
      group: DataGroupTiming,
    }))
    
    this.propertiesInitialize(object)
   
    const { container, content } = object as ClipObject
    if (container) this._containerObject = container
    if (content) this._contentObject = content
  }

  private assureTimingAndSizing(timing: Timing, sizing: Sizing, tweenable: Instance) {
    const { timing: myTiming, sizing: mySizing, containerId } = this
    let timingOk = myTiming !== timing
    let sizingOk = mySizing !== sizing

    timingOk ||= tweenable.hasIntrinsicTiming
    sizingOk ||= tweenable.hasIntrinsicSizing

    // timingOk ||= timing === TimingContainer ? containerOk : contentOk
    // sizingOk ||= sizing === SizingContainer ? containerOk : contentOk

    if (!timingOk) {
      if (timing === TimingContent && containerId) {
        this.timing = TimingContainer
      } else this.timing = TimingCustom
    }
    if (!sizingOk) {
      if (sizing === SizingContent && containerId) {
        this.sizing = SizingContainer 
      } else this.sizing = SizingPreview
    }
    return !(sizingOk && timingOk)
  }

  get audible(): boolean {
    return this.mutable
  }

  clipCachePromise(args: InstanceCacheArgs): Promise<void> {
    const { content, container, frames } = this

    if (isAboveZero(frames)) args.clipTime ||= this.timeRange

    const promises = [content.instanceCachePromise(args)]

    if (container) promises.push(container.instanceCachePromise(args))
    return Promise.all(promises).then(EmptyFunction)
  }

  private _containerObject: InstanceObject = {}

  private _container?: VisibleInstance
  get container(): VisibleInstance | undefined { return this._container ||= this.containerInitialize }
  protected get containerInitialize(): VisibleInstance | undefined {
    const { containerId, _containerObject: containerObject } = this
    const assetId = containerId || containerObject.assetId
    if (!isPopulatedString(assetId)) return undefined

    const definition = (MovieMasher.assetManager).fromId(assetId)


    const object: VisibleInstanceObject  = { ...containerObject, assetId, container: true }
    const instance = definition.instanceFromObject(object)
    assertContainerInstance(instance)


    this.assureTimingAndSizing(TimingContainer, SizingContainer, instance)

    instance.clip = this

    if (this.timing === TimingContainer && this._track) this.resetTiming(instance)
    
    return instance
  }

  declare containerId: string

  private _contentObject: InstanceObject = {}
  
  get content() { return this._content ||= this.contentInitialize }
  
  private _content?: Instance
  
  protected get contentInitialize(): Instance {
    const { contentId, _contentObject: contentObject } = this
    const assetId = contentId || contentObject.assetId
    assertPopulatedString(assetId)

    const definition = (MovieMasher.assetManager).fromId(assetId)

    const object: InstanceObject = { ...contentObject, assetId }
    const instance = definition.instanceFromObject(object)
    assertContentInstance(instance)

    if (this.assureTimingAndSizing(TimingContent, SizingContent, instance)) {
      const { container } = this
      if (container) {
        this.assureTimingAndSizing(TimingContainer, SizingContainer, container)
      }
    }

    instance.clip = this

    if (this.timing === TimingContent && this._track) this.resetTiming(instance)
    return instance
  }

  declare contentId: string

  get assetIds(): Strings {
    const ids = this.content.assetIds
    if (this.container) ids.push(...this.container.assetIds)
    return ids
  }

  get endFrame() { return this.frame + this.frames }

  endTime(quantize : number) : Time {
    return timeFromArgs(this.endFrame, quantize)
  }

  declare frame: number

  declare frames: number
  
  intrinsicsKnown(options: IntrinsicOptions): boolean {
    const { content, container } = this
    let known = content.intrinsicsKnown(options)
    if (container) known &&= container.intrinsicsKnown(options)
    return known
  }

  protected _id?: string
  get id(): string { return this._id ||= idGenerateString() }

  protected _label = ''
  get label(): string { return this._label  }
  set label(value: string) { this._label = value }

  // intrinsicUrls(options: IntrinsicOptions): string[] {
  //   const { content, container } = this
  //   const urls: string[] = []
  //   if (!content.intrinsicsKnown(options)) {
  //     urls.push(...content.intrinsicUrls(options))
  //   }
  //   if (container && !container.intrinsicsKnown(options)) {
  //     urls.push(...container.intrinsicUrls(options))
  //   }
  //   return urls
  // }


  maxFrames(_quantize : number, _trim? : number) : number { return 0 }

  get mutable(): boolean {
    const { content } = this
    const contentMutable = content.mutable()
    if (contentMutable) {
      return true
    }

    const { container } = this
    if (!container) return false
    const containerMutable = container.mutable()
    return  containerMutable
  }

  declare muted: boolean

  get notMuted(): boolean {
    const { content, muted } = this
    if (muted) return false

    if (content.mutable() && !content.muted) return true

    const { container } = this
    if (!container?.mutable()) return true

    return !container.muted
  }
    
  rectIntrinsic(size: Size, loading?: boolean, editing?: boolean): Rect {
    const rect = { ...size, ...PointZero }
    const { sizing } = this
    // console.log(this.constructor.name, 'rectIntrinsic', sizing, loading, editing) 
    if (sizing === SizingPreview) return rect

    const target = sizing === SizingContainer ? this.container : this.content
    assertDefined(target)
    const known = target.intrinsicsKnown({ editing, size: true })
    if (loading && !known) return rect

    assertTrue(known, `${target.constructor.name}.intrinsicsKnown`);


    const targetRect = target.intrinsicRect(editing)
    // console.log(this.constructor.name, 'rectIntrinsic KNOWN', targetRect, sizing, target.assetId)
    return targetRect
  }

  rects(args: ContainerRectArgs): RectTuple {
    const { size, loading, editing } = args
    // console.log(this.constructor.name, 'rects rectIntrinsic', loading, editing)

    const intrinsicRect = this.rectIntrinsic(size, loading, editing)
    // console.log(this.constructor.name, 'rects intrinsicRect', intrinsicRect, args)
    const { container } = this
    assertContainerInstance(container)
    const tuple = container.containerRects(args, intrinsicRect)
    // console.log(this.constructor.name, 'rects', tuple)

    return tuple
  }

  resetTiming(tweenable?: Instance, quantize?: number): void {
    const { timing } = this
    // console.log('resetTiming', timing)
    const track = this.track
    switch(timing) {
      case TimingCustom: {
        
        // console.log('resetTiming', this.frames)
        if (isAboveZero(this.frames)) break

        this.frames = Default.duration * (quantize || track!.mash.quantize)
        break
      }
      case TimingContainer: {
        const container = isContainerInstance(tweenable) ? tweenable : this.container
        if (!container) break

        this.frames = container.frames(quantize || track!.mash.quantize)
        break
      }
      case TimingContent: {
        const content = isContentInstance(tweenable) ? tweenable : this.content
        if (!content) break

        this.frames = content.frames(quantize || track!.mash.quantize)
        break
      }
    }
  }

  selectType: SelectorType = TypeClip


  setValue(value: Scalar, name: string, property?: Property): void {
    super.setValue(value, name, property)
    switch (name) {
      case 'containerId': {
        // console.log(this.constructor.name, 'setValue', name, value, !!property)
        this._containerObject = this._container?.toJSON() || {}
        delete this._container
        break
      }
      case 'contentId': {
        // console.log(this.constructor.name, 'setValue', name, value, !!property)
        this._contentObject = this._content?.toJSON() || {}
        delete this._content
        break
      }
    }
  }

  declare sizing: Sizing


  get timeRange() : TimeRange {
    const { frame, frames, track } = this
    const { quantize } = track.mash
    assertPositive(frame, 'timeRange frame')
    assertAboveZero(frames, 'timeRange frames')

    return timeRangeFromArgs(this.frame, quantize, this.frames)
  }

  // timeRangeRelative(timeRange : TimeRange, _quantize : number) : TimeRange {
  //   const range = this.timeRange.scale(timeRange.fps)
  //   const frame = Math.max(0, timeRange.frame - range.frame)
  //   return timeRange.withFrame(frame)
  // }

  declare timing: Timing

  toJSON(): UnknownRecord {
    const json = super.toJSON()
    const { container, content } = this
    json.content = content
    json.contentId = content.assetId
    if (container) {
      json.container = container
      json.containerId = container.assetId
    } else json.containerId = ''
    return json
  }

  toString(): string {
    return `[Clip ${this.label}]`
  }

  track!: Track 
  // get track() { return this._track! }
  // set track(value) { this._track = value }
  
  get trackNumber(): number { 
    const { track } = this
    return track ? track.index : -1 
  }
  set trackNumber(value: number) { if (value < 0) delete this._track }

  get visible(): boolean {
    return !!this.containerId
  }
}

