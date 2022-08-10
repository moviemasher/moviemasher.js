import { Clip, ClipDefinition, ClipObject } from "./Clip"
import { InstanceBase } from "../../../../Instance/InstanceBase"

import { assertContainer, Container, ContainerObject, ContainerRectArgs } from "../../../../Container/Container"
import { Defined } from "../../../../Base/Defined"
import { assertContent, Content, ContentObject } from "../../../../Content/Content"
import { Property } from "../../../../Setup/Property"
import { Scalar, UnknownObject } from "../../../../declarations"
import { GraphFileArgs, GraphFiles, CommandFileArgs, CommandFiles, CommandFilters, CommandFilterArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs } from "../../../../MoveMe"
import { SelectedItems } from "../../../../Utility/SelectedProperty"
import { ActionType, DataType, SelectType, Timing, TrackType } from "../../../../Setup/Enums"
import { Actions } from "../../../../Editor/Actions/Actions"
import { assertAboveZero, assertPopulatedString, assertPositive, assertTrue, isPopulatedArray, isPopulatedString, isPositive, isUndefined } from "../../../../Utility/Is"
import { isColorContent } from "../../../../Content"
import { arrayLast } from "../../../../Utility/Array"
import { Time, TimeRange } from "../../../../Helpers/Time/Time"
import { Track } from "../../../../Edited/Mash/Track/Track"
import { timeFromArgs, timeRangeFromArgs } from "../../../../Helpers/Time/TimeUtilities"
import { Loader } from "../../../../Loader/Loader"
import { Selectables } from "../../../../Editor/Selectable"
import { assertSize, sizesEqual } from "../../../../Utility/Size"
import { Tweening } from "../../../../Utility/Tween"
import { pointsEqual } from "../../../../Utility/Point"

// const ClipMixin = ClipMixin(InstanceBase)
export class ClipClass extends InstanceBase implements Clip {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { container, content } = object as ClipObject
    if (container) this.containerInitialize(container)
    if (content) this.contentInitialize(content)
  }

  get audible(): boolean {
    return this.mutable
  }

  clipGraphFiles(args: GraphFileArgs): GraphFiles {
    const { quantize } = args
    const fileArgs = { ...args }
    if (isPositive(this.frames)) fileArgs.clipTime ||= this.timeRange(quantize)
    // console.log(this.constructor.name, "clipGraphFiles", fileArgs)
    const files = this.content.graphFiles(fileArgs)
    if (this.container) files.push(...this.container.graphFiles(fileArgs))
    return files
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
      const containerRects = container.containerRects(containerRectArgs)
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
    const containerRects = container.containerRects(containerRectArgs)
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

    const object: ContainerObject  = { ...containerObject, definitionId, container: true }
    const instance = Defined.fromId(definitionId).instanceFromObject(object)
    assertContainer(instance)

    instance.clip = this
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
    const object: ContentObject = { ...contentObject, definitionId, content: true }
    const instance = Defined.fromId(definitionId).instanceFromObject(object)
    assertContent(instance)

    instance.clip = this
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

  iconUrl(preloader: Loader): string | undefined {
    const { icon } = this.definition
    if (!icon) return

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

  selectType = SelectType.Clip

  selectables(): Selectables { return [this, ...this.track.selectables()] }

  selectedItems(actions: Actions): SelectedItems {
    const selected: SelectedItems = []
    const { properties } = this
    const props = properties.filter(property => this.selectedProperty(property))
    props.forEach(property => {
      const { name } = property
      const value = this.value(name)
      selected.push({
        selectType: SelectType.Clip, property, value,
        changeHandler: (property: string, value: Scalar) => {
          const undoValue = this.value(property)
          const redoValue = isUndefined(value) ? undoValue : value
          const options: UnknownObject = { 
            property, target: this, redoValue, undoValue 
          }
          if (property === 'frames') options.type = ActionType.ChangeFrames
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
    if (container) json.container = container
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
    return track ? track.layer : -1 
  }
  set trackNumber(value: number) { if (value < 0) delete this._track }

  trackType = TrackType.Video

  get visible(): boolean {
    return !!this.containerId
  }
}
