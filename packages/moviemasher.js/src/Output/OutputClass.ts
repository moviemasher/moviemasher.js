import { Any, ValueObject, Value } from "../declarations"
import { Default } from "../Setup/Default"
import { Property } from "../Setup/Property"
import { AVType, DataType } from "../Setup/Enums"
import { PropertiedClass } from "../Base/Propertied"
import { OutputOptions } from "./Output"

class OutputClass extends PropertiedClass {
  constructor(...args: Any[]) {
    super(...args)
    const [object] = args
    const {
      options,
      audioCodec,
      audioBitrate,
      audioChannels,
      audioRate,
      videoCodec,
      width,
      height,
      videoBitrate,
      g,
      videoRate,
      format,
    } = object as OutputOptions
    if (audioCodec) this.audioCodec = audioCodec
    if (audioBitrate) this.audioBitrate = audioBitrate
    if (audioChannels) this.audioChannels = audioChannels
    if (audioRate) this.audioRate = audioRate
    if (videoCodec) this.videoCodec = videoCodec
    if (width) this.width = width
    if (height) this.height = height
    if (videoBitrate) this.videoBitrate = videoBitrate
    if (g) this.g = g
    if (videoRate) this.videoRate = videoRate
    if (format) this.format = format
    if (options) Object.assign(this.options, options)

    this.properties.push(new Property({ name: "backcolor", type: DataType.String }))
    this.properties.push(new Property({ name: "options", type: DataType.Object }))
    this.properties.push(new Property({ name: "audioCodec", type: DataType.String }))
    this.properties.push(new Property({ name: "audioBitrate", type: DataType.Number }))
    this.properties.push(new Property({ name: "audioChannels", type: DataType.Number }))
    this.properties.push(new Property({ name: "audioRate", type: DataType.Number }))
    this.properties.push(new Property({ name: "videoCodec", type: DataType.String }))
    this.properties.push(new Property({ name: "width", type: DataType.Number }))
    this.properties.push(new Property({ name: "height", type: DataType.Number }))
    this.properties.push(new Property({ name: "videoBitrate", type: DataType.Number }))
    this.properties.push(new Property({ name: "g", type: DataType.Number }))
    this.properties.push(new Property({ name: "videoRate", type: DataType.Number }))
    this.properties.push(new Property({ name: "format", type: DataType.String }))
  }
  options: ValueObject = {}
  audioCodec = Default.mash.output.audioCodec
  audioBitrate: Value = Default.mash.output.audioBitrate!
  audioChannels = Default.mash.output.audioChannels
  audioRate = Default.mash.output.audioRate
  videoCodec = Default.mash.output.videoCodec
  width = Default.mash.output.width
  height = Default.mash.output.height
  videoBitrate: Value = Default.mash.output.videoBitrate!
  g = Default.mash.output.g
  videoRate = Default.mash.output.videoRate
  format = Default.mash.output.format
}

export { OutputClass }
