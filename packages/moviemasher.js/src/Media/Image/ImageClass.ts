import { SvgItem, ValueObject } from "../../declarations"
import { CommandFile, CommandFiles, GraphFile, PreloadArgs, GraphFiles, VisibleCommandFileArgs, SvgImageOptions } from "../../MoveMe"
import { DefinitionType, LoadType } from "../../Setup/Enums"
import { ImageDefinition, Image } from "./Image"
import { assertPopulatedString, isTimeRange } from "../../Utility/Is"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"
import { ContentMixin } from "../Content/ContentMixin"
import { ContainerMixin } from "../Container/ContainerMixin"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { urlPrependProtocol } from "../../Utility/Url"
import { MediaInstanceBase } from "../MediaInstance/MediaInstanceBase"
import { Rect } from "../../Utility/Rect"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { Requestable } from "../Requestable/Requestable"
import { svgImagePromiseWithOptions } from "../../Utility/Svg"
import { endpointUrl } from "../../Utility/Endpoint"

const ImageWithTweenable = TweenableMixin(MediaInstanceBase)
const ImageWithContainer = ContainerMixin(ImageWithTweenable)
const ImageWithContent = ContentMixin(ImageWithContainer)
const ImageWithPreloadable = PreloadableMixin(ImageWithContent)
const ImageWithUpdatableSize = UpdatableSizeMixin(ImageWithPreloadable)
export class ImageClass extends ImageWithUpdatableSize implements Image {
  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { visible, time, videoRate } = args
    if (!visible) return commandFiles
    
    const files = this.graphFiles(args)
    const [file] = files
    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const options: ValueObject = { loop: 1, framerate: videoRate }
    if (duration) options.t = duration
    const { id } = this
    const commandFile: CommandFile = { ...file, inputId: id, options }
    // console.log(this.constructor.name, "commandFiles", id)
    commandFiles.push(commandFile)
    commandFiles.push(...this.effectsCommandFiles(args))
    return commandFiles
  }

  declare definition: ImageDefinition

  graphFiles(args: PreloadArgs): GraphFiles { 
    const { visible, editing } = args
    const files: GraphFiles = []
    if (!visible) return files
    
    const { definition } = this
    const { request } = definition
    const file = endpointUrl(request.endpoint) 
    if (!file) console.log(this.constructor.name, "graphFiles", request)
    assertPopulatedString(file)

    const graphFile: GraphFile = {
      input: true, type: LoadType.Image, file, definition
    }
    files.push(graphFile)
    return files
  }


  // preloadUrls(args: PreloadArgs): string[] { 
  //   const { visible, editing } = args
  //   const files: string[] = []
  //   if (!visible) return files
    
  //   const { definition } = this
  //   const { url, source } = definition
  //   const file = editing ? urlPrependProtocol('image', url) : source
  //   if (!file) console.log(this.constructor.name, "fileUrls", definition)
  //   assertPopulatedString(file, editing ? 'url' : 'source')

  //   files.push(file)
  //   return files
  // }

  svgItemForTimelinePromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> {
    const { definition } = this
    const transcoding = definition.transcodings.find(transcoding => {
      return transcoding.type === DefinitionType.Image
    })
    const requestable = transcoding || definition
    return requestable.srcPromise.then(url => {
      const svgImageOptions: SvgImageOptions = { ...rect }
      return svgImagePromiseWithOptions(url, svgImageOptions)
    })
  }
}
