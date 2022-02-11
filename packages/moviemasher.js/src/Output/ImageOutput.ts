import { FilesArgs, FilesOptions, FilterGraphArgs, FilterGraphs, GraphFile, Size } from "../declarations"
import { RenderingResult } from "../Api/Rendering"
import { Mash } from "../Edited/Mash/Mash"
import { Time } from "../Helpers/Time"
import { TimeRange } from "../Helpers/TimeRange"
import { Default } from "../Setup/Default"
import { AVType, DataType, GraphType, LoadTypes } from "../Setup/Enums"
import { Property } from "../Setup/Property"
import { ImageOutput, ImageOutputObject, OutputConstructorArgs } from "./Output"
import { OutputClass } from "./OutputClass"
import { Errors } from "../Setup/Errors"
import { EmptyMethod } from "../Setup/Constants"

class ImageOutputClass extends OutputClass implements ImageOutput {
  constructor(args: OutputConstructorArgs) {
    super(args)
    const { output } = args
    const {
      cover,
      height,
      offset,
      width,
    } = output as ImageOutputObject

    if (cover) this.cover = cover
    if (height) this.height = height
    if (offset) this.offset = offset
    if (width) this.width = width

    this.properties.push(new Property({ name: "cover", type: DataType.Boolean }))
    this.properties.push(new Property({ name: "height", type: DataType.Number }))
    this.properties.push(new Property({ name: "offset", type: DataType.Number }))
    this.properties.push(new Property({ name: "width", type: DataType.Number }))
  }

  cover = Default.mash.output.cover

  coverSize(mash: Mash): Size {
    const outputSize = { width: this.width, height: this.height }
    if (this.cover) {
      const start = this.offsetTime()
      const size = mash.size(start)
      if (!size) return outputSize // mash doesn't care about size

      if (size.width === 0 || size.height == 0) throw Errors.internal + 'coverSize'

      const scaleWidth = outputSize.width / size.width
      const scaleHeight = outputSize.height / size.height
      const scale = Math.max(scaleWidth, scaleHeight)
      if (scale >= 1.0) return size

      if (scaleWidth > scaleHeight) outputSize.height *= scale
      else outputSize.width *= scale
    }
    return outputSize
  }

  filesPromise(files: GraphFile[]): Promise<void> | undefined {
    // const remoteFiles = files.filter(fileObject => {
    //   const { type, file } = fileObject
    //   if (!LoadTypes.map(String).includes(String(type))) return false

    //   return file.startsWith('http://')
    // })
    // if (!remoteFiles.length) return

    const unique = [...new Set(files)]

    const { preloader } = this.args
    const promises = unique.map(file => preloader.loadFilePromise(file))
    if (promises.length === 1) return promises[0].then(EmptyMethod)

    return Promise.all(promises).then(EmptyMethod)
  }

  height = Default.mash.output.height

  graphFilesForDuration(): GraphFile[] {
    const { mash } = this
    if (!(this.offset && mash.frames === -1)) return []

    const clips = mash.clips.filter(clip => clip.visible && clip.frames === -1)
    const files = clips.flatMap(clip => {
      const args: FilesArgs = {
        avType: AVType.Video, graphType: GraphType.Mash,
        start: Time.fromArgs(clip.frame, mash.quantize),
        quantize: mash.quantize
      }
      return clip.files(args)
    })
    return files
  }

  offsetTime(): Time {

    const { mash } = this
    const { quantize } = mash

    const frame = this.offset ? Math.round(mash.frames / this.offset) : 0
    return Time.fromArgs(frame, quantize)

  }

  loadFilesForSize(): Promise<void> | undefined {
    if (!this.cover) return Promise.resolve()

    const { mash } = this
    const { quantize } = mash

    const start = this.offsetTime()

    const size = mash.size(start)
    if (!size || (size.width > 0 && size.height > 0)) return Promise.resolve()

    const clips = mash.clipsVisible(start)

    const files = clips.flatMap(clip => {
      const args: FilesArgs = {
        avType: AVType.Video, graphType: GraphType.Mash,
        start, quantize
      }
      return clip.files(args)
    })
    return this.filesPromise(files)
  }

  mashTimeRange(): TimeRange {
    const { offset, mash } = this
    const needDuration = offset && mash.frames < 0
    if (needDuration) return TimeRange.fromArgs(0, 1, mash.quantize)

    return TimeRange.fromTime(mash.timeRange.positionTime(offset, 'ceil'))
  }

  offset = 0

  filterGraphsPromise(renderingResults?: RenderingResult[]): Promise<FilterGraphs> {
    console.log(this.constructor.name, "filterGraphsPromise")
    const { mash } = this
    const durationFiles = this.graphFilesForDuration()
    let promise = this.filesPromise(durationFiles) || Promise.resolve()
    const start = this.mashTimeRange()
    promise = promise.then(() => {
      const clips = mash.clipsVisible(start)

      const offsetFiles = clips.flatMap(clip => {
        const args: FilesArgs = {
          avType: AVType.Video, graphType: GraphType.Mash,
          start, quantize: mash.quantize
        }
        return clip.files(args)
      })
      return this.filesPromise(offsetFiles) || Promise.resolve()
    })
    return promise.then(() => {
      const size = this.coverSize(mash) // calculate output size after loading
      const args: FilterGraphArgs = {
        size, videoRate: mash.quantize,
        timeRange: start,
        graphType: GraphType.Mash,
        avType: AVType.Video
      }
      return mash.filterGraphs(args)
    })
  }

  width = Default.mash.output.width
}

export { ImageOutputClass }
