import { Any } from "../declarations"
import { Default } from "../Setup/Default"
import { DataType } from "../Setup/Enums"
import { Property } from "../Setup/Property"
import { VideoOutputClass } from "./VideoOutput"
import { VideoStreamOutput, VideoStreamOutputObject } from "./Output"

class VideoStreamOutputClass extends VideoOutputClass implements VideoStreamOutput {
  //  constructor(...args: Any[]) {
  //   super(...args)
  //   const [object] = args
  //   const {
  //     cover,
  //     g,
  //     height,
  //     videoBitrate,
  //     videoCodec,
  //     videoRate,
  //     width,
  //   } = object as VideoStreamOutputObject

  //   if (cover) this.cover = cover
  //   if (g) this.g = g
  //   if (height) this.height = height
  //   if (videoBitrate) this.videoBitrate = videoBitrate
  //   if (videoCodec) this.videoCodec = videoCodec
  //   if (videoRate) this.videoRate = videoRate
  //    if (width) this.width = width

  //   this.properties.push(new Property({ name: "cover", type: DataType.Boolean }))
  //   this.properties.push(new Property({ name: "g", type: DataType.Number }))
  //   this.properties.push(new Property({ name: "height", type: DataType.Number }))
  //   this.properties.push(new Property({ name: "videoBitrate", type: DataType.Number }))
  //   this.properties.push(new Property({ name: "videoCodec", type: DataType.String }))
  //   this.properties.push(new Property({ name: "videoRate", type: DataType.Number }))
  //   this.properties.push(new Property({ name: "width", type: DataType.Number }))
  // }

  // cover = Default.mash.output.cover

  // g = Default.mash.output.g

  // height = Default.mash.output.height

  // videoBitrate = Default.mash.output.videoBitrate

  // videoCodec = Default.mash.output.videoCodec

  // videoRate = Default.mash.output.videoRate

  // width = Default.mash.output.width
}

export { VideoStreamOutputClass }
