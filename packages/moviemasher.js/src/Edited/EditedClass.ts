import { PreviewItems, SvgItem, UnknownObject } from "../declarations"
import { assertSizeAboveZero, Size, SizeZero } from "../Utility/Size"
import { GraphFileOptions, GraphFiles } from "../MoveMe"
import { SelectedItems } from "../Utility/SelectedProperty"
import { Emitter } from "../Helpers/Emitter"
import { Errors } from "../Setup/Errors"
import { DataType, EventType, SelectType } from "../Setup/Enums"
import { DataGroup, propertyInstance } from "../Setup/Property"
import { Edited, EditedArgs } from "./Edited"
import { PropertiedClass } from "../Base/Propertied"
import { isAboveZero, isPopulatedString, isUndefined } from "../Utility/Is"
import { idGenerate, idTemporary } from "../Utility/Id"
import { Loader } from "../Loader/Loader"
import { PreviewOptions } from "./Mash/Preview/Preview"
import { Default } from "../Setup/Default"
import { Editor } from "../Editor/Editor"
import { Actions } from "../Editor/Actions/Actions"
import { Selectables } from "../Editor/Selectable"
import { colorBlack } from "../Utility/Color"
import { Mash } from "./Mash"


export class EditedClass extends PropertiedClass implements Edited {
  constructor(args: EditedArgs) {
    super()
    const { createdAt, id, icon, preloader, quantize } = args
    if (preloader) this._preloader = preloader
    if (isPopulatedString(id)) this._id = id
    if (isPopulatedString(icon)) this.icon = icon
    if (isPopulatedString(createdAt)) this.createdAt = createdAt
    if (isAboveZero(quantize)) this.quantize = quantize
    this.properties.push(propertyInstance({ 
      name: 'label', type: DataType.String, defaultValue: ''
    }))
    this.properties.push(propertyInstance({ 
      name: 'color', type: DataType.Rgb, defaultValue: colorBlack
    }))
    this.propertiesInitialize(args)
  }

  declare color: string

  get buffer(): number { throw new Error(Errors.unimplemented + 'get buffer') }
  set buffer(value: number) { throw new Error(Errors.unimplemented + 'set buffer') }

  createdAt = ''

  private data: UnknownObject = {}

  protected dataPopulate(rest: UnknownObject) {
    const propertyNames = this.properties.map(property => property.name)
    Object.entries(rest).forEach(([key, value]) => {
      if (propertyNames.find(name => name === key)) return
      this.data[key] = value
    })
  }

  destroy(): void {}

  _editor?: Editor 
  get editor(): Editor { return this._editor! }
  set editor(value: Editor) { this._editor = value}
  
  _emitter?: Emitter
  get emitter(): Emitter { return this._emitter! }
  set emitter(value: Emitter) {
    this._emitter = value
    this.emitterChanged()
  }

  protected emitterChanged() { }

  editedGraphFiles(args: GraphFileOptions): GraphFiles { return [] }

  icon = ''

  protected _id = ''
  get id(): string { return this._id ||= idTemporary() }
  set id(value: string) {
    this._id = value
    this.emitter?.emit(EventType.Save)
  }

  private _imageSize = { ...SizeZero }
  get imageSize(): Size { return this._imageSize }
  set imageSize(value: Size) {
    assertSizeAboveZero(value, 'imageSize')

    this._imageSize = value
  }

  declare label: string

  loadPromise(args?: GraphFileOptions): Promise<void> { throw Errors.unimplemented }

  get loading(): boolean { return false }

  get mashes(): Mash[]{ throw Errors.unimplemented }

  private _preloader?: Loader
  get preloader(): Loader {
    return this._preloader!
  }
  
  putPromise(): Promise<void> { throw new Error(Errors.unimplemented) }

  quantize = Default.mash.quantize

  reload(): Promise<void> | undefined { return }

  selectables(): Selectables { return [] }

  selectType = SelectType.None

  selectedItems(actions: Actions): SelectedItems { return [] }

  previewItems(options: PreviewOptions): Promise<PreviewItems> { throw Errors.unimplemented }
  
  toJSON(): UnknownObject {
    const json = super.toJSON()
    json.createdAt = this.createdAt
    json.quantize = this.quantize
    json.id = this.id
    if (this.icon) json.icon = this.icon
    Object.entries(this.data).forEach(([key, value]) => {
      if (isUndefined(json[key])) json[key] = value
    })
    return json
  }
}
