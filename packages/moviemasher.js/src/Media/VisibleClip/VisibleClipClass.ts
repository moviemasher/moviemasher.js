import { VisibleClip, VisibleClipDefinition, VisibleClipObject } from "./VisibleClip"
import { InstanceBase } from "../../Instance/InstanceBase"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"

import { assertContainer, Container, ContainerObject } from "../../Container/Container"
import { Defined } from "../../Base/Defined"
import { assertContent, Content, ContentObject } from "../../Content/Content"
import { Property } from "../../Setup/Property"
import { Rect, Scalar, SvgFilters, UnknownObject } from "../../declarations"
import { GraphFileArgs, GraphFiles, SelectedProperties, CommandFileArgs, CommandFiles, CommandFilters, CommandFilterArgs, ContentCommandFileArgs, ContainerCommandFileArgs, ContainerCommandFilterArgs, ContentCommandFilterArgs } from "../../MoveMe"
import { ActionType, SelectType, SelectTypes, TrackType } from "../../Setup/Enums"
import { Actions } from "../../Editor/Actions/Actions"
import { assertDimensions, assertPopulatedString, assertTrue, isPopulatedString, isUndefined } from "../../Utility/Is"
import { isColorContent } from "../../Content"
import { arrayLast } from "../../Utility/Array"
import { TrackPreview } from "../../Editor/Preview/TrackPreview/TrackPreview"
import { assert } from "console"
import { Dimensions, dimensionsEven } from "../../Setup/Dimensions"
import { Time, TimeRange } from "../../Helpers/Time/Time"

const VisibleClipMixin = VisibleMixin(ClipMixin(InstanceBase))
export class VisibleClipClass extends VisibleClipMixin implements VisibleClip {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { container, content } = object as VisibleClipObject
    if (container) this.containerInitialize(container)
    if (content) this.contentInitialize(content)
  }

  commandFiles(args: CommandFileArgs): CommandFiles {
    const commandFiles:CommandFiles = []
    const { visible, quantize, outputDimensions, time } = args
    const clipTime = this.timeRange(quantize)
    const { content, container } = this
    const contentArgs: ContentCommandFileArgs = { ...args, clipTime }
    if (visible && outputDimensions && container) {
      contentArgs.containerRects = container.containerRects(outputDimensions, time, clipTime, true)
      const colors = isColorContent(content) ? content.tweenValues('color', time, clipTime) : undefined
      if (!colors) {
        commandFiles.push(...content.contentCommandFiles(contentArgs))
      }
      const containerArgs: ContainerCommandFileArgs = { ...contentArgs, colors }
      commandFiles.push(...container.containerCommandFiles(containerArgs))
    } else {
      assertTrue(!visible, 'outputDimensions && container')
      commandFiles.push(...this.content.contentCommandFiles(contentArgs)) 
    }
    return commandFiles
  }

  commandFilters(args: CommandFilterArgs): CommandFilters {
    const commandFilters:CommandFilters = []
    const { visible, quantize, outputDimensions, time } = args
    const clipTime = this.timeRange(quantize)

    let previousOutput = ''
    const contentArgs: ContentCommandFilterArgs = { ...args, clipTime }

    const { content, container } = this
    if (visible && outputDimensions && container) {
      contentArgs.containerRects = container.containerRects(outputDimensions, time, clipTime)
      
      const colors = isColorContent(content) ? content.tweenValues('color', time, clipTime) : undefined
      if (!colors) {
        commandFilters.push(...content.contentCommandFilters(contentArgs))
        previousOutput = arrayLast(arrayLast(commandFilters).outputs)
      }
      const containerArgs: ContainerCommandFilterArgs = { 
        ...contentArgs, colors, filterInput: previousOutput 
      }
      commandFilters.push(...container.containerCommandFilters(containerArgs))
    } else {
      assertTrue(!visible, 'outputDimensions && container')
      commandFilters.push(...this.content.contentCommandFilters(contentArgs)) 
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
    // console.log(this.constructor.name, "containerInitialize", object)
    const instance = Defined.fromId(definitionId).instanceFromObject(object)
    assertContainer(instance)
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
    // console.log(this.constructor.name, "contentInitialize", object)
    const instance = Defined.fromId(definitionId).instanceFromObject(object)
    assertContent(instance)
    return this._content = instance
  }

  declare contentId: string

  declare definition: VisibleClipDefinition

  definitionIds(): string[] {
    const ids = [
      ...super.definitionIds(),
      ...this.content.definitionIds(),
    ]
    if (this.container) ids.push(...this.container.definitionIds())
    return ids
  }

  graphFiles(args: GraphFileArgs): GraphFiles {
    const files = this.content.graphFiles(args)
    if (this.container) files.push(...this.container.graphFiles(args))
    return files
  }


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

  svgFilters(previewDimensions: Dimensions, containerRect: Rect, time: Time, range: TimeRange): SvgFilters { 
    const svgFilters: SvgFilters = []
    const { container, content } = this
    if (container) svgFilters.push(...container.containerSvgFilters(previewDimensions, containerRect, time, range))
    return svgFilters
  }

  toJSON(): UnknownObject {
    const json = super.toJSON()
    const { container, content } = this
    json.content = content
    if (container) json.container = container
    return json
  }

  toString(): string {
    return `[VisibleClip ${this.label}]`
  }

  trackType = TrackType.Video
}
