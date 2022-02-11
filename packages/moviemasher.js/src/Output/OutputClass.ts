import { ValueObject, FilterGraphs } from "../declarations"
import { Property } from "../Setup/Property"
import { DataType, OutputFormat, OutputType } from "../Setup/Enums"
import { PropertiedClass } from "../Base/Propertied"
import { OutputConstructorArgs } from "./Output"
import { Errors } from "../Setup/Errors"
import { outputDefaultFormatByType, outputDefaultTypeByFormat } from "../Helpers/OutputDefault"
import { RenderingResult } from "../Api/Rendering"
import { Mash } from "../Edited/Mash/Mash"

class OutputClass extends PropertiedClass {
  constructor(object: OutputConstructorArgs) {
    super(object.output)
    const { output, mash, cacheDirectory } = object
    this.args = object
    const { options, format, type } = output
    if (!(format || type)) throw Errors.invalid.type

    this.format = format || outputDefaultFormatByType[type!]
    this.type = type || outputDefaultTypeByFormat[format!]
    if (options) Object.assign(this.options, options)

    this.properties.push(new Property({ name: "options", type: DataType.Object }))
    this.properties.push(new Property({ name: "format", type: DataType.String }))
    this.properties.push(new Property({ name: "type", type: DataType.String }))

    this.cacheDirectory = cacheDirectory

    this.mash = mash
  }

  args: OutputConstructorArgs

  cacheDirectory: string

  format: OutputFormat

  mash: Mash

  options: ValueObject = {}

  filterGraphsPromise(renderingResults?: RenderingResult[]): Promise<FilterGraphs> {
    throw Errors.unimplemented
  }

  type: OutputType
}

export { OutputClass }
