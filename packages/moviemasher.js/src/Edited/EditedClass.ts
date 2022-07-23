import { UnknownObject } from "../declarations"
import { Size } from "../Utility/Size"
import { GraphFileOptions, GraphFiles } from "../MoveMe"
import { Emitter } from "../Helpers/Emitter"
import { Errors } from "../Setup/Errors"
import { DataType, EventType } from "../Setup/Enums"
import { propertyInstance } from "../Setup/Property"
import { Edited, EditedArgs } from "./Edited"
import { PropertiedClass } from "../Base/Propertied"
import { isAboveZero, isUndefined } from "../Utility/Is"
import { idGenerate } from "../Utility/Id"
import { Loader } from "../Loader/Loader"
import { PreviewOptions, Svg, Svgs } from "../Editor/Preview/Preview"
import { Default } from "../Setup/Default"


export class EditedClass extends PropertiedClass implements Edited {
  constructor(args: EditedArgs) {
    super()
    const { createdAt, id, label, preloader, quantize } = args
    if (preloader) this._preloader = preloader
    if (id) this._id = id
    if (createdAt) this.createdAt = createdAt
    if (label) this.label = label
    if (isAboveZero(quantize)) this.quantize = quantize

    this.properties.push(propertyInstance({ name: 'label', type: DataType.String }))
  }

  declare backcolor: string

  get buffer(): number { throw new Error(Errors.unimplemented + 'get buffer') }
  set buffer(value: number) { throw new Error(Errors.unimplemented + 'set buffer') }

  createdAt = ''

  data: UnknownObject = {}

  protected dataPopulate(rest: UnknownObject) {
    const propertyNames = this.properties.map(property => property.name)
    Object.entries(rest).forEach(([key, value]) => {
      if (propertyNames.find(name => name === key)) return
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

  graphFiles(args: GraphFileOptions): GraphFiles { return [] }

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
  }
  declare label: string


  loadPromise(args?: GraphFileOptions): Promise<void> { throw Errors.unimplemented }

  get loading(): boolean { return false }

  private _preloader?: Loader
  get preloader(): Loader {
    return this._preloader!
  }
  
  putPromise(): Promise<void> { throw new Error(Errors.unimplemented) }

  quantize = Default.mash.quantize

  reload(): Promise<void> | undefined { return }

  // svgElement(options: PreviewOptions): SVGSVGElement {
  //   throw Errors.unimplemented
  // }
  
  svg(options: PreviewOptions): Svg { throw Errors.unimplemented }

  svgs(options: PreviewOptions): Svgs { throw Errors.unimplemented }
  
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
}
