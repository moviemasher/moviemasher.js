import { Any } from "../declarations"
import { Default } from "../Setup/Default"
import { DataType } from "../Setup/Enums"
import { Property } from "../Setup/Property"
import { OutputConstructorArgs, WaveformOutput, WaveformOutputObject } from "./Output"
import { OutputClass } from "./OutputClass"

class WaveformOutputClass extends OutputClass implements WaveformOutput {
  constructor(args: OutputConstructorArgs) {
    super(args)
    const { output } = args
    const {
      forecolor,
      height,
      backcolor,
      width,

    } = output as WaveformOutputObject

    if (forecolor) this.forecolor = forecolor
    if (height) this.height = height
    if (backcolor) this.backcolor = backcolor
    if (width) this.width = width

    this.properties.push(new Property({ name: "forecolor", type: DataType.String }))
    this.properties.push(new Property({ name: "height", type: DataType.Number }))
    this.properties.push(new Property({ name: "backcolor", type: DataType.String }))
    this.properties.push(new Property({ name: "width", type: DataType.Number }))
  }

  backcolor = ''

  forecolor = '#000000'

  height = Default.mash.output.height

  width = Default.mash.output.width
}

export { WaveformOutputClass }
