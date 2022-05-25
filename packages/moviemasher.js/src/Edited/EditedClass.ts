import { Size, UnknownObject, VisibleContextData, VisibleSources } from "../declarations"
import { Emitter } from "../Helpers/Emitter"
import { Errors } from "../Setup/Errors"
import { DataType, EventType } from "../Setup/Enums"
import { propertyInstance } from "../Setup/Property"
import { Edited, EditedArgs } from "./Edited"
import { PropertiedClass } from "../Base/Propertied"
import { isAboveZero, isUndefined } from "../Utility/Is"
import { idGenerate } from "../Utility/Id"
import { EditorDefinitions } from "../Editor/EditorDefinitions/EditorDefinitions"
import { Preloader } from "../Preloader/Preloader"
import { EditorDefinitionsClass } from "../Editor/EditorDefinitions/EditorDefinitionsClass"
import { VisibleContext } from "../Context/VisibleContext"
import { ContextFactory } from "../Context/ContextFactory"
import { pixelColor } from "../Utility/Pixel"

export class EditedClass extends PropertiedClass implements Edited {
  constructor(args: EditedArgs) {
    super()
    const { createdAt, id, label, definitions, preloader } = args

    if (preloader) this._preloader = preloader

    this.definitions = definitions || new EditorDefinitionsClass()

    if (id) this._id = id
    if (createdAt) this.createdAt = createdAt
    if (label) this.label = label

    this.properties.push(propertyInstance({ name: 'label', type: DataType.String }))

    this.backgroundVisibleContext = ContextFactory.visible({ label: `${this.constructor.name} ${this.label}` })
  }

  declare backcolor: string

  backgroundVisibleContext: VisibleContext


  get buffer(): number { throw new Error(Errors.unimplemented) }
  set buffer(value: number) { throw new Error(Errors.unimplemented) }

  createdAt = ''

  data: UnknownObject = {}

  definitions: EditorDefinitions

  protected dataPopulate(rest: UnknownObject) {
    Object.entries(rest).forEach(([key, value]) => {
      if (this.properties.find(property => property.name === key)) return
      this.data[key] = value
    })
  }

  destroy(): void {}

  _emitter?: Emitter
  get emitter(): Emitter | undefined { return this._emitter }
  set emitter(value: Emitter | undefined) {
    this._emitter = value
    this.emitterChanged()
  }
  protected emitterChanged() { }

  protected _id = ''
  get id(): string { return this._id ||= idGenerate() }
  set id(value: string) {
    this._id = value
    this.emitter?.emit(EventType.Save)
  }

  private _imageSize = { width: 300, height: 150 }
  get imageSize(): Size { return this._imageSize }
  set imageSize(value: Size) {
    const { width, height } = value
    if (!(isAboveZero(width) && isAboveZero(height))) throw Errors.invalid.size
    this._imageSize = value
    this.backgroundVisibleContext.size = value
  }
  declare label: string

  get loading(): boolean { return false }

  private _preloader?: Preloader
  get preloader(): Preloader {
    return this._preloader!
  }

  drawBackground() {
    const { backgroundVisibleContext, backcolor } = this
    backgroundVisibleContext.clear()
    if (backcolor) backgroundVisibleContext.drawFill(pixelColor(backcolor))
  }

  toJSON(): UnknownObject {
    const json = super.toJSON()
    json.createdAt = this.createdAt
    json.id = this.id
    if (this.icon) json.icon = this.icon
    Object.entries(this.data).forEach(([key, value]) => {
      if (isUndefined(json[key])) json[key] = value
    })
    return json
  }

  get visibleSources(): VisibleSources {
    return this.visibleContexts.map(visibleContext => visibleContext.visibleSource)
  }

  get visibleContext(): VisibleContext {
    const context = ContextFactory.toSize(this.imageSize)
    this.visibleSources.forEach(visibleSource => { context.draw(visibleSource) })
    return context
  }

  get visibleContexts(): VisibleContext[] { return [] }
}
