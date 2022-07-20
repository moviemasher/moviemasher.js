import { VisibleClip, VisibleClipDefinition, VisibleClipObject } from "./VisibleClip"
import { InstanceBase } from "../../Instance/InstanceBase"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"

import { assertContainer, Container, ContainerObject } from "../../Container/Container"
import { Defined } from "../../Base/Defined"
import { assertContent, Content, ContentObject } from "../../Content/Content"
import { Property } from "../../Setup/Property"
import { Scalar, SvgFilters, UnknownObject } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { GraphFileArgs, GraphFiles, SelectedProperties, CommandFileArgs, CommandFiles, CommandFilters, CommandFilterArgs } from "../../MoveMe"
import { ActionType, SelectType, SelectTypes, TrackType } from "../../Setup/Enums"
import { Actions } from "../../Editor/Actions/Actions"
import { assertPopulatedString, assertTrue, isPopulatedString, isUndefined } from "../../Utility/Is"
import { isColorContent } from "../../Content"
import { arrayLast } from "../../Utility/Array"
import { Size } from "../../Utility/Size"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Effects } from "../Effect/Effect"
import { effectInstance } from "../Effect/EffectFactory"

const VisibleClipMixin = ClipMixin(InstanceBase)
export class VisibleClipClass extends VisibleClipMixin implements VisibleClip {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { container, content, effects } = object as VisibleClipObject
    if (container) this.containerInitialize(container)
    if (content) this.contentInitialize(content)
    if (effects) this.effects.push(...effects.map(effect => effectInstance(effect)))

  }

  get audible(): boolean {
    return this.mutable
  }

  clipGraphFiles(args: GraphFileArgs): GraphFiles {
    const { quantize } = args
    const clipTime = this.timeRange(quantize)
    const fileArgs = { ...args, clipTime }
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
    // console.log(this.constructor.name, "commandFiles", visible, outputSize, container)

    if (visible && outputSize && container) {
      // console.log("container", typeof container, container?.constructor.name)
      contentArgs.containerRects = container.containerRects(outputSize, time, clipTime, true)
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
      contentArgs.containerRects = container.containerRects(outputSize, time, clipTime)
      
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
    // console.log(this.constructor.name, "contentInitialize", object, instance.constructor.name, instance.definitionId, instance.type)
    return this._content = instance
  }

  declare contentId: string

  declare definition: VisibleClipDefinition

  definitionIds(): string[] {
    const ids = [
      ...super.definitionIds(),
      ...this.content.definitionIds(),
    ]

    ids.push(...this.effects.flatMap(effect => effect.definitionIds()))

    if (this.container) ids.push(...this.container.definitionIds())
    return ids
  }

  effects: Effects = []

  get mutable(): boolean {
    return this.content.mutable || !!this.container?.mutable
  }

  declare muted: boolean

  get notMuted(): boolean {
    const { content, muted } = this
    if (muted) return false

    if (content.mutable && !content.muted) return true

    const { container } = this
    if (!container?.mutable) return true

    return !container.muted
  }

  selectedProperties(actions: Actions, selectTypes: SelectType[] = SelectTypes): SelectedProperties {
    const selectedProperties: SelectedProperties = []
    const { trackInstance } = this
    const dense = trackInstance?.dense
    const selectTypesByName: Record<string, SelectType> = {
      containerId: SelectType.Container,
      contentId: SelectType.Content,
    }
    this.properties.forEach(property => {
      const { name } = property
       // frame is set by dense tracks
      if (name === 'frame' && dense) return
      const selectType = selectTypesByName[name] || SelectType.Clip
      if (!selectTypes.includes(selectType)) return

      selectedProperties.push({
        selectType, property, value: this.value(name),
        changeHandler: (property: string, value: Scalar) => {
          const undoValue = this.value(property)
          const redoValue = isUndefined(value) ? undoValue : value
          const options: UnknownObject = { property, target: this, redoValue, undoValue }
          if (property === 'frames') options.type = ActionType.ChangeFrames
          actions.create(options)
        },
      })
    })
    const { container, content } = this
    if (selectTypes.includes(SelectType.Content)) {
      selectedProperties.push(...content.selectedProperties(actions, SelectType.Content))
    }
    if (container && selectTypes.includes(SelectType.Container)) {
      selectedProperties.push(...container.selectedProperties(actions, SelectType.Container))
    }
    return selectedProperties
  }


  // private changeClip(property: string, value: Scalar): void {
  //   const { clip } = this.selection
  //   if (!clip) throw new Error(Errors.selection)
  //   assertPopulatedString(property, 'changeClip property')
  //   const redoValue = isUndefined(value) ? clip.value(property) : value
  //   const undoValue = clip.value(property)
  //   const options: UnknownObject = { property, target: clip, redoValue, undoValue }

  //   switch (options.property) {
  //     case 'frames': {
  //       options.type = ActionType.ChangeFrames
  //       break
  //     }
  //     case 'trim': {
  //       options.type = ActionType.ChangeTrim
  //       // TODO: make sure there's a test for this
  //       // not sure where this was derived from - using original clip??
  //       options.frames = clip.frames + Number(options.undoValue)
  //       break
  //     }
  //     default: options.type = ActionType.Change
  //   }
  //   this.actions.create(options)
  // }



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

  svgFilters(previewSize: Size, containerRect: Rect, time: Time, range: TimeRange): SvgFilters { 
    const svgFilters: SvgFilters = []
    const { container, content } = this
    if (container) svgFilters.push(...container.containerSvgFilters(previewSize, containerRect, time, range))
    return svgFilters
  }

  toJSON(): UnknownObject {
    const json = super.toJSON()
    const { container, content } = this
    json.content = content
    json.effects = this.effects
    if (container) json.container = container
    return json
  }

  toString(): string {
    return `[VisibleClip ${this.label}]`
  }

  trackType = TrackType.Video

  get visible(): boolean {
    return !!this.containerId
  }
}
