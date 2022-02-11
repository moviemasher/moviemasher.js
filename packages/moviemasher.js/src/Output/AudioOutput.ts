import { Any } from "../declarations"
import { Default } from "../Setup/Default"
import { DataType } from "../Setup/Enums"
import { Property } from "../Setup/Property"
import { AudioOutput, AudioOutputObject, OutputConstructorArgs } from "./Output"
import { OutputClass } from "./OutputClass"

class AudioOutputClass extends OutputClass implements AudioOutput {
  constructor(args: OutputConstructorArgs) {
    super(args)
    const { output } = args
    const {

    } = output as AudioOutputObject

    this.properties.push(new Property({ name: "audioCodec", type: DataType.String }))
    this.properties.push(new Property({ name: "audioBitrate", type: DataType.Number }))
    this.properties.push(new Property({ name: "audioChannels", type: DataType.Number }))
    this.properties.push(new Property({ name: "audioRate", type: DataType.Number }))
  }

  audioBitrate = Default.mash.output.audioBitrate

  audioChannels = Default.mash.output.audioChannels

  audioCodec = Default.mash.output.audioCodec

  audioRate = Default.mash.output.audioRate
}

export { AudioOutputClass }
