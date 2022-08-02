import { Clip, ClipDefinition, ClipObject } from "./Clip"
import { InstanceBase } from "../../Instance/InstanceBase"

import { assertContainer, Container, ContainerObject, ContainerRectArgs } from "../../Container/Container"
import { Defined } from "../../Base/Defined"
import { assertContent, Content, ContentObject } from "../../Content/Content"
import { Property } from "../../Setup/Property"
import { Scalar, SvgFilters, UnknownObject } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { GraphFileArgs, GraphFiles, CommandFileArgs, CommandFiles, CommandFilters, CommandFilterArgs } from "../../MoveMe"
import { SelectedItems } from "../../Utility/SelectedProperty"
import { ActionType, DataType, SelectType, Timing, TrackType } from "../../Setup/Enums"
import { Actions } from "../../Editor/Actions/Actions"
import { assertAboveZero, assertPopulatedString, assertPositive, assertTrue, isPopulatedString, isPositive, isUndefined } from "../../Utility/Is"
import { isColorContent } from "../../Content"
import { arrayLast } from "../../Utility/Array"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Track } from "../../Edited/Mash/Track/Track"
import { timeFromArgs, timeRangeFromArgs } from "../../Helpers/Time/TimeUtilities"
import { Loader } from "../../Loader/Loader"
import { Selectables } from "../../Editor/Selectable"

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
    if (isPositive(this.frames)) fileArgs.clipTime = this.timeRange(quantize)
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

    if (visible && outputSize && container) {
      // console.log("container", typeof container, container?.constructor.name)
      const containerRectArgs: ContainerRectArgs = {
        size: outputSize, time, timeRange: clipTime, loading: true
      }
      
      contentArgs.containerRects = container.containerRects(containerRectArgs)

      const colors = isColorContent(content) ? content.contentColors(time, clipTime) : undefined
      if (!colors) {
        const contentFiles = content.commandFiles(contentArgs)
        // console.log(this.constructor.name, "commandFiles content:", contentFiles.length)
        commandFiles.push(...contentFiles)
      }
      const containerArgs: CommandFileArgs = { ...contentArgs, contentColors: colors }
      const containerFiles = container.commandFiles(containerArgs)

      // console.log(this.constructor.name, "commandFiles container:", containerFiles.length)
      commandFiles.push(...containerFiles)
    } else {
      assertTrue(!visible, 'outputSize && container')
      commandFiles.push(...this.content.commandFiles(contentArgs)) 
    }
    return commandFiles
  }

  commandFilters(args: CommandFilterArgs): CommandFilters {
    const commandFilters:CommandFilters = []
    const { visible, quantize, outputSize: outputSize, time } = args
    const clipTime = this.timeRange(quantize)

    let previousOutput = ''
    const contentArgs: CommandFilterArgs = { ...args, clipTime }

    const { content, container } = this
    if (visible && outputSize && container) {
      const containerRectArgs: ContainerRectArgs = {
        size: outputSize, time, timeRange: clipTime
      }
      contentArgs.containerRects = container.containerRects(containerRectArgs)
      // console.log(this.constructor.name, "commandFilters", contentArgs.containerRects)
      const isColor = isColorContent(content)
      const colors = isColor ? content.contentColors(time, clipTime) : undefined

      if (!colors) {
        commandFilters.push(...content.commandFilters(contentArgs))
        previousOutput = arrayLast(arrayLast(commandFilters).outputs)
      }
      const containerArgs: CommandFilterArgs = { 
        ...contentArgs, contentColors: colors, filterInput: previousOutput, container: true
      }
      commandFilters.push(...container.commandFilters(containerArgs))
    } else {
      assertTrue(!visible, 'outputSize && container')
      commandFilters.push(...this.content.commandFilters(contentArgs)) 
    }
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

  definitionTime(quantize : number, time : Time) : Time {
    const scaledTime = super.definitionTime(quantize, time)
    const startTime = this.time(quantize).scale(scaledTime.fps)
    const endTime = this.endTime(quantize).scale(scaledTime.fps)

    const frame = Math.max(Math.min(scaledTime.frame, endTime.frame), startTime.frame)
    return scaledTime.withFrame(frame - startTime.frame)
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
    return this.content.mutable() || this.container?.mutable() || false
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
