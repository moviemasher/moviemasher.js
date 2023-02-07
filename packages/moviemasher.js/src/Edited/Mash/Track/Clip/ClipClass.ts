import { PreviewItems, Scalar, SvgItems, SvgOrImage, UnknownObject } from "../../../../declarations"

import { Clip, ClipObject, IntrinsicOptions } from "./Clip"

import { assertContainer, Container, ContainerObject, ContainerRectArgs, DefaultContainerId, isContainer } from "../../../../Media/Container/Container"
import { Defined } from "../../../../Base/Defined"
import { assertContent, Content, ContentObject, DefaultContentId, isContent } from "../../../../Media/Content/Content"
import { DataGroup, Property, propertyInstance } from "../../../../Setup/Property"
import { PreloadArgs, GraphFiles, CommandFileArgs, CommandFiles, CommandFilters, CommandFilterArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs, Component, ServerPromiseArgs } from "../../../../MoveMe"
import { SelectedItems } from "../../../../Utility/SelectedProperty"
import { ActionType, DataType, Duration, SelectType, Sizing, Sizings, Timing, Timings } from "../../../../Setup/Enums"
import { Actions } from "../../../../Editor/Actions/Actions"
import { assertAboveZero, assertPopulatedString, assertPositive, assertTrue, isAboveZero, isPopulatedArray, isPopulatedString } from "../../../../Utility/Is"
import { isColorContent } from "../../../../Media/Content"
import { arrayLast } from "../../../../Utility/Array"
import { Time, TimeRange } from "../../../../Helpers/Time/Time"
import { Track } from "../../../../Edited/Mash/Track/Track"
import { timeFromArgs, timeRangeFromArgs } from "../../../../Helpers/Time/TimeUtilities"
import { Selectables } from "../../../../Editor/Selectable"
import { assertSizeAboveZero, Size, sizeCover, sizeEven, sizesEqual } from "../../../../Utility/Size"
import { Tweening } from "../../../../Utility/Tween"
import { pointsEqual, PointZero } from "../../../../Utility/Point"
import { assertTweenable, Tweenable } from "../../../../Mixin/Tweenable/Tweenable"
import { Default } from "../../../../Setup/Default"
import { Rect, rectsEqual, RectTuple } from "../../../../Utility/Rect"
import { svgAppend, svgSvgElement, svgSetDimensions } from "../../../../Utility/Svg"
import { pixelToFrame } from "../../../../Utility/Pixel"
import { Preview, PreviewArgs } from "../../../../Editor/Preview/Preview"
import { PreviewClass } from "../../../../Editor/Preview/PreviewClass"
import { isAudio } from "../../../../Media/Audio/Audio"
import { PropertiedClass } from "../../../../Base/Propertied"
import { idGenerateString } from "../../../../Utility/Id"
import { EmptyMethod } from "../../../../Setup/Constants"

export class ClipClass extends PropertiedClass implements Clip {
  constructor(...args: any[]) {
    super(...args)

    this.properties.push(propertyInstance({
      name: "containerId", type: DataType.ContainerId,
      defaultValue: DefaultContainerId
    }))
    this.properties.push(propertyInstance({
      name: "contentId", type: DataType.ContentId,
      defaultValue: DefaultContentId
    }))
    this.properties.push(propertyInstance({ 
      name: "label", type: DataType.String 
    }))
    this.properties.push(propertyInstance({ 
      name: "sizing", type: DataType.Option, defaultValue: Sizing.Content,
      options: Sizings,
    }))
    this.properties.push(propertyInstance({ 
      name: "timing", type: DataType.Option, defaultValue: Timing.Content,
      group: DataGroup.Timing, options: Timings
    }))
    this.properties.push(propertyInstance({ 
      name: "frame",
      type: DataType.Frame, 
      group: DataGroup.Timing, 
      defaultValue: Duration.None, min: 0, step: 1
    }))
    this.properties.push(propertyInstance({ 
      name: "frames", type: DataType.Frame, defaultValue: Duration.Unknown,
      min: 1, step: 1,
      group: DataGroup.Timing,
    }))
    
    const [object] = args
    this.propertiesInitialize(object)
   
    const { container, content } = object as ClipObject
    this.containerInitialize(container || {})
    this.contentInitialize(content || {})
  }

  private assureTimingAndSizing(timing: Timing, sizing: Sizing, tweenable: Tweenable) {
    const { type } = tweenable
    const { timing: myTiming, sizing: mySizing, containerId } = this
    // const containerOk = containerId !== DefaultContainerId
    // const contentOk = contentId !== DefaultContentId

    let timingOk = myTiming !== timing
    let sizingOk = mySizing !== sizing

    timingOk ||= tweenable.hasIntrinsicTiming
    sizingOk ||= tweenable.hasIntrinsicSizing

    // timingOk ||= timing === Timing.Container ? containerOk : contentOk
    // sizingOk ||= sizing === Sizing.Container ? containerOk : contentOk

    if (!timingOk) {
      if (timing === Timing.Content && containerId) {
        this.timing = Timing.Container
      } else this.timing = Timing.Custom
      // console.log(this.constructor.name, "assureTimingAndSizing setting timing", type, isTimingDefinitionType(type), myTiming, "->", this.timing)
    }
    if (!sizingOk) {
      if (sizing === Sizing.Content && containerId) {
        this.sizing = Sizing.Container 
      } else this.sizing = Sizing.Preview
      // console.log(this.constructor.name, "assureTimingAndSizing setting sizing", type, isSizingDefinitionType(type), mySizing, "->", this.sizing)
    }
    return !(sizingOk && timingOk)
  }

  get audible(): boolean {
    return this.mutable
  }

  clipIcon(size: Size, scale: number, buffer = 1): Promise<SvgOrImage> | undefined {
    const { container } = this

    // TODO: display audio waveform...
    if (!container) return 

    const { track } = this


    const { quantize, imageSize } = track.mash
    assertSizeAboveZero(imageSize, 'track.mash.imageSize')

    const frameSize = sizeEven(sizeCover(imageSize, size, true))
    assertSizeAboveZero(frameSize, `${this.constructor.name}.clipIcon containedSize`)


    const widthAndBuffer = frameSize.width + buffer
    const cellCount = Math.ceil(size.width / widthAndBuffer)
    const clipTime = this.timeRange(quantize)
    const { startTime } = clipTime

    const previews: Preview[] = []
    const { mash } = track
    let pixel = 0
    for (let i = 0; i < cellCount; i++) {
      const { copy: time } = startTime
      const previewArgs: PreviewArgs = { 
        mash, time, clip: this, size: frameSize,
      }
      const preview = new PreviewClass(previewArgs)
      previews.push(preview)
      pixel += widthAndBuffer
      startTime.frame = clipTime.frame + pixelToFrame(pixel, scale, 'floor')
    }
    let svgItemsPromise = Promise.resolve([] as SvgItems)
    previews.forEach(preview => {
      svgItemsPromise = svgItemsPromise.then(items => {
        return preview.svgItemsPromise.then(svgItems => {
          return [...items, ...svgItems]
        })
      })
    })
 
    return svgItemsPromise.then(svgItems => {
      const point = { ...PointZero }
      const containerSvg = svgSvgElement(size)
      svgItems.forEach(groupItem => {
        svgSetDimensions(groupItem, point)
        svgAppend(containerSvg, groupItem)
        point.x += widthAndBuffer
      })
      return containerSvg
    })
  }

  clipCommandFiles(args: CommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { visible, quantize, outputSize: outputSize, time } = args
    const clipTime = this.timeRange(quantize)
    const { content, container } = this
    const contentArgs: CommandFileArgs = { ...args, clipTime }
    // console.log(this.constructor.name, "commandFiles", visible, outputSize)

    
    if (visible) {
      assertSizeAboveZero(outputSize, 'outputSize')
      assertContainer(container)
      const containerRectArgs: ContainerRectArgs = {
        size: outputSize, time, timeRange: clipTime, loading: true
      }

      // console.log(this.constructor.name, "clipCommandFiles", containerRects)

      const containerRects = this.rects(containerRectArgs)

      const colors = isColorContent(content) ? content.contentColors(time, clipTime) : undefined
      
      const fileArgs: VisibleCommandFileArgs = { 
        ...contentArgs, outputSize, contentColors: colors, containerRects 
      }
      if (!colors) {
        const contentFiles = content.visibleCommandFiles(fileArgs)
        // console.log(this.constructor.name, "commandFiles content:", contentFiles.length)
        commandFiles.push(...contentFiles)
      }
      const containerFiles = container.visibleCommandFiles(fileArgs)

      // console.log(this.constructor.name, "commandFiles container:", containerFiles.length)
      commandFiles.push(...containerFiles)
    } else {
      assertTrue(!visible, 'outputSize && container')
      commandFiles.push(...this.content.audibleCommandFiles(contentArgs)) 
    }
    return commandFiles
  }

  commandFilters(args: CommandFilterArgs): CommandFilters {
    const commandFilters:CommandFilters = []
    const { visible, quantize, outputSize, time } = args
    const clipTime = this.timeRange(quantize)
    const contentArgs: CommandFilterArgs = { ...args, clipTime }
    const { content, container } = this
    if (!visible) return this.content.audibleCommandFilters(contentArgs)
      
    assertSizeAboveZero(outputSize, 'outputSize')
    assertContainer(container)
    
    const containerRectArgs: ContainerRectArgs = {
      size: outputSize, time, timeRange: clipTime
    }
    const containerRects = this.rects(containerRectArgs)
    contentArgs.containerRects = containerRects
    const tweening: Tweening = { 
      point: !pointsEqual(...containerRects),
      size: !sizesEqual(...containerRects),
    }

    // console.log(this.constructor.name, "commandFilters", contentArgs.containerRects)
    const isColor = isColorContent(content)
    const colors = isColor ? content.contentColors(time, clipTime) : undefined

    const hasColorContent = isPopulatedArray(colors)
    if (hasColorContent) {
      tweening.color = colors[0] !== colors[1]
      tweening.canColor = tweening.color ? container.canColorTween(args) : container.canColor(args)
    }

    const timeDuration = time.isRange ? time.lengthSeconds : 0
    const duration = timeDuration ? Math.min(timeDuration, clipTime.lengthSeconds) : 0
    
    const containerArgs: VisibleCommandFilterArgs = { 
      ...contentArgs, contentColors: colors, outputSize, containerRects, duration
    }
    if (hasColorContent) {
      if (!tweening.canColor) {
        // inject color filter, I will alphamerge to colorize myself later
        commandFilters.push(...container.containerColorCommandFilters(containerArgs))
        containerArgs.filterInput = arrayLast(arrayLast(commandFilters).outputs)
      }
    } else {
      commandFilters.push(...content.commandFilters(containerArgs, tweening))
      containerArgs.filterInput = arrayLast(arrayLast(commandFilters).outputs)
    }

    commandFilters.push(...container.commandFilters(containerArgs, tweening, true))
     
    return commandFilters
  }

  private _container?: Container
  get container() { return this._container || this.containerInitialize() }
  private containerInitialize(containerObject: ContainerObject = {}): Container | undefined {
    const { containerId } = this
    const definitionId = containerId || containerObject.definitionId
    if (!isPopulatedString(definitionId)) return

    const definition = Defined.fromId(definitionId)


    const object: ContainerObject  = { ...containerObject, definitionId, container: true }
    const instance = definition.instanceFromObject(object)
    assertContainer(instance)


    this.assureTimingAndSizing(Timing.Container, Sizing.Container, instance)

    instance.clip = this

    if (this.timing === Timing.Container && this._track) this.resetTiming(instance)
    
    // console.log(this.constructor.name, "containerInitialize", object, instance.constructor.name, instance.definitionId, instance.type)
    return this._container = instance
  }

  declare containerId: string

  private _content?: Content
  get content() { return this._content || this.contentInitialize() }
  private contentInitialize(contentObject: ContentObject = {}) {
    const { contentId } = this
    const definitionId = contentId || contentObject.definitionId
    assertPopulatedString(definitionId)

    const definition = Defined.fromId(definitionId)

    const object: ContentObject = { ...contentObject, definitionId }
    const instance = definition.instanceFromObject(object)
    assertContent(instance)

    if (this.assureTimingAndSizing(Timing.Content, Sizing.Content, instance)) {
      const { container } = this
      if (container) {
        this.assureTimingAndSizing(Timing.Container, Sizing.Container, container)
      }
    }

    instance.clip = this

    if (this.timing === Timing.Content && this._track) this.resetTiming(instance)
    // console.log(this.constructor.name, "contentInitialize", object, instance.constructor.name, instance.definitionId, instance.type)
    return this._content = instance
  }

  declare contentId: string

  // copy(): Clip {
  //   const object = { ...this.toJSON(), id: '' }
  //   return this.definition.instanceFromObject(object)
  // }

  // declare definition: ClipDefinition

  definitionIds(): string[] {
    const ids = this.content.definitionIds()
    if (this.container) ids.push(...this.container.definitionIds())
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

  intrinsicGraphFiles(options: IntrinsicOptions): GraphFiles {
    const { content, container } = this
    const files: GraphFiles = []
    if (!content.intrinsicsKnown(options)) {
      files.push(content.intrinsicGraphFile(options))
    }
    if (container && !container.intrinsicsKnown(options)) {
      files.push(container.intrinsicGraphFile(options))
    }
    return files
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


  loadPromise(args: PreloadArgs): Promise<void> {
    const { quantize } = args
    const { content, container, frames } = this

    if (isAboveZero(frames)) args.clipTime ||= this.timeRange(quantize)

    const promises = [content.loadPromise(args)]

    if (container) promises.push(container.loadPromise(args))
    return Promise.all(promises).then(EmptyMethod)
  }

  maxFrames(_quantize : number, _trim? : number) : number { return 0 }

  get mutable(): boolean {
    const { content } = this
    const contentMutable = content.mutable()
    if (contentMutable) {
      // console.log(this.constructor.name, "mutable content", content.definitionId, content.definition.id)
      return true
    }

    const { container } = this
    if (!container) return false
    const containerMutable = container.mutable()
    // console.log(this.constructor.name, "mutable container", containerMutable, container.definitionId, container.definition.id)
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
    
  previewItemsPromise(size: Size, time: Time, component: Component): Promise<PreviewItems> {
    
    assertSizeAboveZero(size, 'previewItemsPromise')

    const timeRange = this.timeRange(this.track.mash.quantize)
    const { container, content } = this
    assertContainer(container)
  

    const containerRectArgs: ContainerRectArgs = {
      size, time, timeRange, editing: true, //loading: true,
    }
    // console.log(this.constructor.name, "previewItemsPromise rects", containerRectArgs)
    const containerRects = this.rects(containerRectArgs)
    assertTrue(rectsEqual(...containerRects))

    const [containerRect] = containerRects
    return container.previewItemsPromise(content, containerRect, size, time, timeRange, component)
  }

  rectIntrinsic(size: Size, loading?: boolean, editing?: boolean): Rect {
    const rect = { ...size, ...PointZero }
    const { sizing } = this
    if (sizing === Sizing.Preview) return rect

    const target = sizing === Sizing.Container ? this.container : this.content
    assertTweenable(target)
    const known = target.intrinsicsKnown({ editing, size: true })
    if (loading && !known) return rect


    assertTrue(known, 'intrinsicsKnown')

    const targetRect = target.intrinsicRect(editing)
    // console.log(this.constructor.name, "rectIntrinsic KNOWN", targetRect, sizing, target.definition.label)
    return targetRect
  }

  rects(args: ContainerRectArgs): RectTuple {
    const { size, loading, editing } = args
    // console.log(this.constructor.name, "rects rectIntrinsic", loading, editing)

    const intrinsicRect = this.rectIntrinsic(size, loading, editing)
    // console.log(this.constructor.name, "rects intrinsicRect", intrinsicRect, args)
    const { container } = this
    assertContainer(container)

    return container.containerRects(args, intrinsicRect)
  }

  resetTiming(tweenable?: Tweenable, quantize?: number): void {
    const { timing } = this
    // console.log("resetTiming", timing)
    const track = this._track
    switch(timing) {
      case Timing.Custom: {
        
        // console.log("resetTiming", this.frames)
        if (isAboveZero(this.frames)) break

        this.frames = Default.duration * (quantize || track!.mash.quantize)
        break
      }
      case Timing.Container: {
        const container = isContainer(tweenable) ? tweenable : this.container
        if (!container) break

        // if (!isUpdatableDuration(container)) break

        this.frames = container.frames(quantize || track!.mash.quantize)
        break
      }
      case Timing.Content: {
        const content = isContent(tweenable) ? tweenable : this.content
        if (!content) break

        // if (!isUpdatableDuration(content)) break    

        this.frames = content.frames(quantize || track!.mash.quantize)
        break
      }
    }
  }

  selectType = SelectType.Clip

  selectables(): Selectables { return [this, ...this.track.selectables()] }

  selectedItems(actions: Actions): SelectedItems {
    const selected: SelectedItems = []
    const { properties } = this
    const props = properties.filter(property => this.selectedProperty(property))
    props.forEach(property => {
      const { name } = property
      const isFrames = name === 'frames' || name === 'frame'
      const undoValue = this.value(name)
      const target = this
      selected.push({
        value: undoValue,
        selectType: SelectType.Clip, property, 
        changeHandler: (property: string, redoValue: Scalar) => {
          assertPopulatedString(property)

          const options = { property, target, redoValue, undoValue,
            type: isFrames ? ActionType.ChangeFrame : ActionType.Change
          }
          actions.create(options)
        }
      })
    })
    return selected
  }

  private selectedProperty(property: Property): boolean {
    const { name, type } = property
    switch(type) {
      case DataType.ContainerId:
      case DataType.ContentId: return false
    }
    switch(name) {
      case 'sizing': return !isAudio(this.content)
      case 'timing': {
        if (this.content.hasIntrinsicTiming) break
        return !!this.container?.hasIntrinsicSizing
      }
      case 'frame': return !this.track.dense
      case 'frames': return this.timing === Timing.Custom
    }
    return true
  }

  serverPromise(args: ServerPromiseArgs): Promise<void> {
    const { content, container } = this
    const promises = [content.serverPromise(args)]
    if (container) promises.push(container.serverPromise(args))
    return Promise.all(promises).then(EmptyMethod)  
  }

  setValue(value: Scalar, name: string, property?: Property): void {
    super.setValue(value, name, property)
    switch (name) {
      case 'containerId': {
        // console.log(this.constructor.name, "setValue", name, value, !!property)
        if (this._container) this.containerInitialize(this._container.toJSON())
        break
      }
      case 'contentId': {
        // console.log(this.constructor.name, "setValue", name, value, !!property)
        if (this._content) this.contentInitialize(this._content.toJSON())
        break
      }
    }
  }

  declare sizing: Sizing

  // private _svgElement?: SVGSVGElement
  // private get svgElement() { 
  //   return this._svgElement ||= svgElement() 
  // }

  // private updateSvg(rect: Rect) {
  //   svgSetDimensions(this.svgElement, rect)
  // }

  time(quantize : number) : Time { return timeFromArgs(this.frame, quantize) }

  timeRange(quantize : number) : TimeRange {
    const { frame, frames } = this
    assertPositive(frame, "timeRange frame")
    assertAboveZero(frames, "timeRange frames")

    return timeRangeFromArgs(this.frame, quantize, this.frames)
  }

  timeRangeRelative(timeRange : TimeRange, quantize : number) : TimeRange {
    const range = this.timeRange(quantize).scale(timeRange.fps)
    const frame = Math.max(0, timeRange.frame - range.frame)
    return timeRange.withFrame(frame)
  }


  declare timing: Timing

  toJSON(): UnknownObject {
    const json = super.toJSON()
    const { container, content } = this
    json.content = content
    json.contentId = content.definitionId
    if (container) {
      json.container = container
      json.containerId = container.definitionId
    } else json.containerId = ""
    return json
  }

  toString(): string {
    return `[Clip ${this.label}]`
  }

  _track?: Track 
  get track() { return this._track! }
  set track(value) { this._track = value }
  
  get trackNumber(): number { 
    const { track } = this
    return track ? track.index : -1 
  }
  set trackNumber(value: number) { if (value < 0) delete this._track }

  get visible(): boolean {
    return !!this.containerId
  }
}
