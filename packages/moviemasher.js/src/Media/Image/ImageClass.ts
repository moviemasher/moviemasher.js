import { ValueRecord } from "../../Types/Core"
import { SvgItem } from "../../Helpers/Svg/Svg"
import { CommandFile, CommandFiles, GraphFile, PreloadArgs, GraphFiles, VisibleCommandFileArgs } from "../../Base/Code"
import { ImageType } from "../../Setup/Enums"
import { ImageMedia, Image } from "./Image"
import { assertPopulatedString, isDefiniteError, isTimeRange } from "../../Utility/Is"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"
import { ContentMixin } from "../Content/ContentMixin"
import { ContainerMixin } from "../Container/ContainerMixin"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { MediaInstanceBase } from "../MediaInstanceBase"
import { Rect, RectOptions } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { svgImagePromiseWithOptions } from "../../Helpers/Svg/SvgFunctions"
import { assertEndpoint, endpointUrl } from "../../Helpers/Endpoint/EndpointFunctions"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { requestImagePromise } from "../../Helpers/Request/RequestFunctions"

const ImageWithTweenable = TweenableMixin(MediaInstanceBase)
const ImageWithContainer = ContainerMixin(ImageWithTweenable)
const ImageWithContent = ContentMixin(ImageWithContainer)
const ImageWithUpdatableSize = UpdatableSizeMixin(ImageWithContent)
export class ImageClass extends ImageWithUpdatableSize implements Image {
  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { visible, time, videoRate } = args
    if (!visible) return commandFiles
    
    const files = this.graphFiles(args)
    const [file] = files
    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const options: ValueRecord = { loop: 1, framerate: videoRate }
    if (duration) options.t = duration
    const { id } = this
    const commandFile: CommandFile = { ...file, inputId: id, options }
    // console.log(this.constructor.name, "commandFiles", id)
    commandFiles.push(commandFile)
    commandFiles.push(...this.effectsCommandFiles(args))
    return commandFiles
  }

  declare definition: ImageMedia

  graphFiles(args: PreloadArgs): GraphFiles { 
    const { visible, editing } = args
    const files: GraphFiles = []
    if (!visible) return files
    
    const { definition } = this
    const { request } = definition
    const { endpoint } = request
    assertEndpoint(endpoint)
    const file = endpointUrl(endpoint) 
    if (!file) console.log(this.constructor.name, "graphFiles", request)
    assertPopulatedString(file)

    const graphFile: GraphFile = {
      input: true, type: ImageType, file, definition
    }
    files.push(graphFile)
    return files
  }

  svgItemForTimelinePromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> {
    const { definition } = this
    const requestable = definition.preferredTranscoding(ImageType)
    const { request } = requestable
    return requestImagePromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      const { src } = clientImage
      const svgImageOptions: RectOptions = { ...rect }
      return svgImagePromiseWithOptions(src, svgImageOptions)
    })
  }
}
