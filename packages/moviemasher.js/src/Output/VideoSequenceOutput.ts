import { Any } from "../declarations"
import { Default } from "../Setup/Default"
import { DataType } from "../Setup/Enums"
import { Property } from "../Setup/Property"
import { AudioOutputClass } from "./AudioOutput"
import { OutputConstructorArgs, VideoSequenceOutput, VideoSequenceOutputObject } from "./Output"

class VideoSequenceOutputClass extends AudioOutputClass implements VideoSequenceOutput {
   constructor(args: OutputConstructorArgs) {
    super(args)
    const { output } = args
    const {
      cover,
      videoRate,
      height,
      quality,
      width,
    } = output as VideoSequenceOutputObject

    if (cover) this.cover = cover
    if (videoRate) this.videoRate = videoRate
    if (height) this.height = height
    if (quality) this.quality = quality
    if (width) this.width = width

    this.properties.push(new Property({ name: "cover", type: DataType.Boolean }))
    this.properties.push(new Property({ name: "videoRate", type: DataType.Number }))
    this.properties.push(new Property({ name: "height", type: DataType.Number }))
    this.properties.push(new Property({ name: "quality", type: DataType.Number }))
    this.properties.push(new Property({ name: "width", type: DataType.Number }))

   }

  cover = Default.mash.output.cover

  videoRate = Default.mash.output.videoRate

  height = Default.mash.output.height

  quality = 1

  width = Default.mash.output.width
}

export { VideoSequenceOutputClass }
