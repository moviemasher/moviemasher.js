import { VisibleClip, VisibleClipDefinition, VisibleClipObject } from "./VisibleClip"
import { InstanceBase } from "../../Instance/InstanceBase"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { ChainLinks } from "../../Filter/Filter"

import { assertContainer, Container, ContainerObject } from "../../Container/Container"
import { Defined } from "../../Base/Defined"
import { assertContent, Content, ContentObject } from "../../Content/Content"
import { Property } from "../../Setup/Property"
import { Scalar, UnknownObject } from "../../declarations"
import { Chain, ChainArgs, GraphFileArgs, GraphFiles, SelectedProperties, ContainerChainArgs, ContentChainArgs } from "../../MoveMe"
import { ActionType, SelectType, SelectTypes, TrackType } from "../../Setup/Enums"
import { Actions } from "../../Editor/Actions/Actions"
import { assertTrue, isPopulatedString, isUndefined } from "../../Utility/Is"
import { isColorContent } from "../../Content"
import { chainAppend, chainFinalize } from "../../Utility/Chain"

const VisibleClipMixin = VisibleMixin(ClipMixin(InstanceBase))
export class VisibleClipClass extends VisibleClipMixin implements VisibleClip {
  constructor(...args: any[]) {
    super(...args)
    const [object] = args
    const { container, content } = object as VisibleClipObject
    if (container) this.containerInitialize(container)
    if (content) this.contentInitialize(content)
  }

  chainLinks(): ChainLinks {
    const links: ChainLinks = []
    links.push(this.content)
    if (this.container) links.push(this.container)
    links.push(...super.chainLinks())
    return links
  }


  chain(args: ChainArgs): Chain {
    const chain: Chain = { commandFilters: [], commandFiles: [] }
    const { commandFilters, commandFiles } = chain
    const { audible, visible } = args
    let inputCount = args.inputCount

    const { content, container } = this
    if (visible) {
      assertContainer(container)
      const color = isColorContent(content) ? content.color : undefined
      const containerArgs: ContainerChainArgs = { ...args, color, inputCount: inputCount }
      chainAppend(chain, container.containerChain(containerArgs))
      if (!color) {
        const contentArgs: ContentChainArgs = {
          ...containerArgs, containerDimensions: container.intrinsicDimensions()
        }
        chainAppend(chain, content.contentChain(contentArgs))
      }
    } else {
      assertTrue(audible, 'audible')
    }
    chainFinalize(chain, args)
    return chain
  }

  private _container?: Container
  get container() { return this._container || this.containerInitialize() }
  private containerInitialize(containerObject: ContainerObject = {}): Container | undefined {
    const { containerId } = this
    // console.log(this.constructor.name, "containerInitialize", containerId, containerObject)
    if (!isPopulatedString(containerId)) return

    const instance = Defined.fromId(this.containerId).instanceFromObject(containerObject)
    assertContainer(instance)
    return this._container = instance
  }

  declare containerId: string

  private _content?: Content
  get content() { return this._content || this.contentInitialize() }
  private contentInitialize(contentObject: ContentObject = {}) {
    const { contentId } = this
    // console.log(this.constructor.name, "contentInitialize", contentId, contentObject)
    const instance = Defined.fromId(contentId).instanceFromObject(contentObject)
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
    this.properties().forEach(property => {
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
        delete this._container
        break
      }
      case 'contentId': {
        // console.log(this.constructor.name, "setValue", name, value, !!property)
        delete this._content
        break
      }
    }
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
