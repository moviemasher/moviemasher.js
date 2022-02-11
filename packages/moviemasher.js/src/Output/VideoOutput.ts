import { Any } from "../declarations"
import { Default } from "../Setup/Default"
import { DataType } from "../Setup/Enums"
import { Property } from "../Setup/Property"
import { AudioOutputClass } from "./AudioOutput"
import { OutputConstructorArgs, VideoOutput, VideoOutputObject } from "./Output"

class VideoOutputClass extends AudioOutputClass implements VideoOutput {
   constructor(args: OutputConstructorArgs) {
    super(args)
    const { output } = args
    const {
      cover,
      g,
      height,
      videoBitrate,
      videoCodec,
      videoRate,
      width,
    } = output as VideoOutputObject

    if (cover) this.cover = cover
    if (g) this.g = g
    if (height) this.height = height
    if (videoBitrate) this.videoBitrate = videoBitrate
    if (videoCodec) this.videoCodec = videoCodec
    if (videoRate) this.videoRate = videoRate
     if (width) this.width = width

    this.properties.push(new Property({ name: "cover", type: DataType.Boolean }))
    this.properties.push(new Property({ name: "g", type: DataType.Number }))
    this.properties.push(new Property({ name: "height", type: DataType.Number }))
    this.properties.push(new Property({ name: "videoBitrate", type: DataType.Number }))
    this.properties.push(new Property({ name: "videoCodec", type: DataType.String }))
    this.properties.push(new Property({ name: "videoRate", type: DataType.Number }))
    this.properties.push(new Property({ name: "width", type: DataType.Number }))
  }

  cover = Default.mash.output.cover

  g = Default.mash.output.g

  height = Default.mash.output.height

  videoBitrate = Default.mash.output.videoBitrate

  videoCodec = Default.mash.output.videoCodec

  videoRate = Default.mash.output.videoRate

  width = Default.mash.output.width
}

export { VideoOutputClass }




      // const { height, width } = this

      // const graphType = GraphType.Mash
      // const size = { width, height }
      // const args: FilterGraphArgs = {
      //   size, videoRate, timeRange,
      //   graphType
      // }
      // const filterGraphs = this.mashInstance.filterGraphs(args)
      // if (filterGraphs.length > 1) {


      //   const intermediateArgs = outputDefaultFromOptions({ type: OutputType.Video })

      //   // TODO: render to intermediate and concat
      //   filterGraphs.forEach(segment => {
      //     const destination = `${this.idDirectory}/.mp4`
      //     const commandArgs = filterGraphToCommandArgs(segment, output, destination, graphType)
      //     // console.log(commandArgs)


      //     const render = CommandFactory.instance(this.id, commandArgs, this.args.endpoint)
      //     render.addListener('error', error => {
      //       console.error(error, commandArgs)
      //       throw String(error)
      //     })
      //     render.runPromise().then(error => {
      //       if (error) throw error
      //       console.log("rendered!")
      //     })
      //   })
      // } else {
      //   const [segment] = filterGraphs


      // }
