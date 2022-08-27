import { Clip, ClipDefinition, ClipObject } from "./Clip"
import { InstanceBase } from "../../../../Instance/InstanceBase"

import { assertContainer, Container, ContainerObject, ContainerRectArgs, isContainer } from "../../../../Container/Container"
import { Defined } from "../../../../Base/Defined"
import { assertContent, Content, ContentObject, isContent } from "../../../../Content/Content"
import { Property } from "../../../../Setup/Property"
import { Scalar, SvgItems, SvgItemsTuple, SvgOrImage, UnknownObject } from "../../../../declarations"
import { GraphFileArgs, GraphFiles, CommandFileArgs, CommandFiles, CommandFilters, CommandFilterArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs } from "../../../../MoveMe"
import { SelectedItems } from "../../../../Utility/SelectedProperty"
import { ActionType, DataType, DefinitionType, isSizingDefinitionType, isTimingDefinitionType, SelectType, Sizing, Timing } from "../../../../Setup/Enums"
import { Actions } from "../../../../Editor/Actions/Actions"
import { assertAboveZero, assertPopulatedString, assertPositive, assertTrue, isAboveZero, isNumber, isPopulatedArray, isPopulatedObject, isPopulatedString, isPositive } from "../../../../Utility/Is"
import { isColorContent } from "../../../../Content"
import { arrayLast } from "../../../../Utility/Array"
import { Time, TimeRange, Times } from "../../../../Helpers/Time/Time"
import { Track } from "../../../../Edited/Mash/Track/Track"
import { timeFromArgs, timeRangeFromArgs } from "../../../../Helpers/Time/TimeUtilities"
import { Selectables } from "../../../../Editor/Selectable"
import { assertSize, Size, sizeCover, sizesEqual } from "../../../../Utility/Size"
import { Tweening } from "../../../../Utility/Tween"
import { pointsEqual, PointZero } from "../../../../Utility/Point"
import { assertTweenable, isUpdatableDuration, isUpdatableSize, Tweenable } from "../../../../Mixin"
import { Default } from "../../../../Setup/Default"
import { Rect, rectsEqual, RectTuple } from "../../../../Utility/Rect"
import { svgDefsElement, svgElement, svgFilterElement, svgGroupElement, svgMaskElement, svgPolygonElement, svgUseElement } from "../../../../Utility/Svg"
import { pixelToFrame } from "../../../../Utility/Pixel"
import { colorFromRgb, colorRgbDifference, colorToRgb, colorWhite } from "../../../../Utility/Color"
import { idGenerate } from "../../../../Utility"

export class ClipClass extends InstanceBase implements Clip {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { container, content } = object as ClipObject
    if (isPopulatedObject(container)) this.containerInitialize(container)
    if (isPopulatedObject(content)) this.contentInitialize(content)
  }

  get audible(): boolean {
    return this.mutable
  }

  clipGraphFiles(args: GraphFileArgs): GraphFiles {
    const { quantize } = args
    if (isAboveZero(this.frames)) args.clipTime ||= this.timeRange(quantize)
    // console.log(this.constructor.name, "clipGraphFiles", fileArgs)
    const files = this.content.graphFiles(args)
    if (this.container) files.push(...this.container.graphFiles(args))
    return files
  }

  clipIcon(size: Size, scale: number, buffer = 1, color?: string): Promise<SvgOrImage> | undefined {
    const { quantize, preloader, imageSize, backcolor: mashColor } = this.track.mash
    const backcolor = color || mashColor
    const containedSize = sizeCover(imageSize, size, true)
    const widthAndBuffer = containedSize.width + buffer
    const cellCount = Math.ceil(size.width / widthAndBuffer)
    const clipTime = this.timeRange(quantize)
    const files: GraphFiles = []
    const rect = { ...PointZero, ...containedSize }
    const { startTime } = clipTime
    
    const times: Times = []
    const args: GraphFileArgs = {
      icon: true,
      time: startTime, clipTime, editing: true, visible: true, quantize
    }
    for (let i = 0; i < cellCount; i++) {
      times.push(startTime.copy)
      files.push(...this.clipGraphFiles({ ...args, time: startTime }))
      rect.x += containedSize.width + buffer
      startTime.frame = clipTime.frame + pixelToFrame(rect.x, scale, 'floor')
    }
    rect.x = 0
    const promise = preloader.loadFilesPromise(files)
    return promise.then(() => {
      const rect = { ...PointZero, ...size }
      const containerSvg = svgElement(size)
    
      const defsElement = svgDefsElement()
      containerSvg.appendChild(defsElement)

      const backgroundElement = svgGroupElement(size)
      containerSvg.appendChild(backgroundElement)

      backgroundElement.appendChild(svgPolygonElement(size, '', backcolor))
      
      
      const rgb = colorToRgb(backcolor)
      const differenceRgb = colorRgbDifference(rgb)
      const forecolor = colorFromRgb(differenceRgb)

      times.forEach((time, index) => {
        const groupItem = svgGroupElement()
        const [defs, items] = this.svgElement(containedSize, time, index)
        defs.forEach(def => defsElement.appendChild(def))
        items.forEach(item => groupItem.appendChild(item))
    

        groupItem.setAttribute('transform', `translate(${rect.x}, 0)`)
        containerSvg.appendChild(groupItem)
        rect.x += containedSize.width
        const bufferRect = { ...rect, width: buffer }
        const bufferSvg = svgPolygonElement(bufferRect, '', forecolor)
        backgroundElement.appendChild(bufferSvg)
        rect.x += buffer
      })
      return containerSvg
    })
  }

  commandFiles(args: CommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { visible, quantize, outputSize: outputSize, time } = args
    const clipTime = this.timeRange(quantize)
    const { content, container } = this
    const contentArgs: CommandFileArgs = { ...args, clipTime }
    // console.log(this.constructor.name, "commandFiles", visible, outputSize)

    
    if (visible) {
      assertSize(outputSize)
      assertContainer(container)
      const containerRectArgs: ContainerRectArgs = {
        size: outputSize, time, timeRange: clipTime, loading: true
      }
      const containerRects = this.rects(containerRectArgs)
      contentArgs.containerRects = containerRects

      const colors = isColorContent(content) ? content.contentColors(time, clipTime) : undefined
      
      const containerArgs: VisibleCommandFileArgs = { 
        ...contentArgs, outputSize, contentColors: colors, containerRects 
      }
      if (!colors) {
        const contentFiles = content.commandFiles(containerArgs)
        // console.log(this.constructor.name, "commandFiles content:", contentFiles.length)
        commandFiles.push(...contentFiles)
      }
      const containerFiles = container.commandFiles(containerArgs)

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
    const { visible, quantize, outputSize: outputSize, time } = args
    const clipTime = this.timeRange(quantize)
    const contentArgs: CommandFilterArgs = { ...args, clipTime }
    const { content, container } = this
    if (!visible) return this.content.audibleCommandFilters(contentArgs)
      
    assertSize(outputSize)
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

  assureTimingAndSizing(timing: Timing, sizing: Sizing, type: DefinitionType) {
    const { timing: myTiming, sizing: mySizing } = this
    if (myTiming === timing && !isTimingDefinitionType(type)) {
      this.timing = Timing.Custom
    }
    if (mySizing === sizing && !isSizingDefinitionType(type)) {
      this.sizing = Sizing.Preview
    }
  }

  private _container?: Container
  get container() { return this._container || this.containerInitialize() }
  private containerInitialize(containerObject: ContainerObject = {}): Container | undefined {
    const { containerId, timing, sizing } = this
    const definitionId = containerId || containerObject.definitionId
    if (!isPopulatedString(definitionId)) return

    const object: ContainerObject  = { ...containerObject, definitionId, container: true }
    const instance = Defined.fromId(definitionId).instanceFromObject(object)
    assertContainer(instance)

    instance.clip = this
    const { type } = instance
    this.assureTimingAndSizing(Timing.Container, Sizing.Container, type)

    if (this.timing === Timing.Container && this._track) this.resetDuration(instance)
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
    const object: ContentObject = { ...contentObject, definitionId }
   
    const instance = Defined.fromId(definitionId).instanceFromObject(object)
    assertContent(instance)

    instance.clip = this
    const { type } = instance
    this.assureTimingAndSizing(Timing.Content, Sizing.Content, type)

    if (this.timing === Timing.Content && this._track) this.resetDuration(instance)
    // console.log(this.constructor.name, "contentInitialize", object, instance.constructor.name, instance.definitionId, instance.type)
    return this._content = instance
  }

  declare contentId: string

  copy(): Clip {
    const object = { ...this.toJSON(), id: '' }
    return this.definition.instanceFromObject(object)
  }

  declare definition: ClipDefinition

  definitionIds(): string[] {
    const ids = [
      ...super.definitionIds(),
      ...this.content.definitionIds(),
    ]
    if (this.container) ids.push(...this.container.definitionIds())
    return ids
  }

  get endFrame() { return this.frame + this.frames }

  endTime(quantize : number) : Time {
    return timeFromArgs(this.endFrame, quantize)
  }

  declare frame: number

  declare frames: number
  
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

  rectIntrinsic(size: Size, loading?: boolean, editing?: boolean): Rect {
    const rect = { ...size, ...PointZero }
    const { sizing } = this
    if (loading || sizing === Sizing.Preview) return rect

    const target = sizing === Sizing.Container ? this.container : this.content
    assertTweenable(target)
    if (!target.intrinsicsKnown(editing)) return rect

    return target.intrinsicRect(editing)
  }

  rects(args: ContainerRectArgs): RectTuple {
    const { size, loading, editing } = args
    const intrinsicRect = this.rectIntrinsic(size, loading, editing)

    const { container } = this
    assertContainer(container)

    return container.containerRects(args, intrinsicRect)
  }

  resetDuration(tweenable?: Tweenable, quantize?: number): void {
    const { timing } = this
    // console.log("resetDuration", timing)
    const track = this._track
    switch(timing) {
      case Timing.Custom: {
        if (isPositive(this.frames)) break

        this.frames = Default.duration * (quantize || track!.mash.quantize)
        break
      }
      case Timing.Container: {
        const container = isContainer(tweenable) ? tweenable : this.container
        if (!container) break

        if (!isUpdatableDuration(container)) break

        this.frames = container.frames(quantize || track!.mash.quantize)
        break
      }
      case Timing.Content: {
        const content = isContent(tweenable) ? tweenable : this.content
        if (!content) break

        if (!isUpdatableDuration(content)) break    

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
      case 'frame': return !this.track.dense
      case 'frames': return this.timing === Timing.Custom
    }
    return true
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
    
  svgElement(size: Size, time?: Time, iconIndex?: number): SvgItemsTuple {
    // TODO: make luminance a property of container...
    const luminance = true

    const icon = isNumber(iconIndex)
    const defs: SvgItems = []
    const items: SvgItems = []
    const tuple: SvgItemsTuple = [defs, items]
    
    const timeRange = this.timeRange(this.track.mash.quantize)
    const svgTime = time || timeRange.startTime
    const { container, content, id } = this
    assertContainer(container)
    
    const containerRectArgs: ContainerRectArgs = {
      size, time: svgTime, timeRange, editing: true,
    }
    const containerRects = this.rects(containerRectArgs)
    assertTrue(rectsEqual(...containerRects))

    const [rect] = containerRects
    const containerSvgItem = container.containerSvgItem(rect, svgTime, timeRange, icon)
    defs.push(containerSvgItem)

    let containerId = icon ? idGenerate('container') : `container-${id}` 

    const updatable = isUpdatableSize(container)
    if (!icon && updatable) {
      console.log("!icon && updatable")
      const polygonElement = svgPolygonElement(rect, '', '', containerId)
      polygonElement.setAttribute('vector-effect', 'non-scaling-stroke;')
      defs.push(polygonElement)
      containerId = idGenerate('container')
    }

    containerSvgItem.setAttribute('id', containerId)

    const contentSvgItem = content.contentSvgItem(rect, svgTime, timeRange, icon)

    items.push(contentSvgItem)

    contentSvgItem.classList.add('contained')
    const maskElement = svgMaskElement(size, contentSvgItem, luminance)
    defs.push(maskElement)

    const useContainerInMask = svgUseElement(containerId)
    maskElement.appendChild(useContainerInMask)
    if (!updatable) {
      containerSvgItem.setAttribute('vector-effect', 'non-scaling-stroke;')
      useContainerInMask.setAttribute('fill', colorWhite)
    }
    

    const containerSvgFilters = container.containerSvgFilters(size, rect, svgTime, timeRange)
    if (containerSvgFilters.length) {
      const filter = svgFilterElement(containerSvgFilters, containerSvgItem)
      defs.push(filter)
    }
    return tuple
  }

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

  declare sizing: Sizing

  declare timing: Timing

  toJSON(): UnknownObject {
    const json = super.toJSON()
    const { container, content } = this
    json.content = content
    json.contentId = content.definitionId
    if (container) {
      json.container = container
      json.containerId = container.definitionId
    }
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
