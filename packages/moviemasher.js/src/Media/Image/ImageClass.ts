import { ValueObject } from "../../declarations"
import { CommandFile, CommandFileArgs, CommandFiles, GraphFile, GraphFileArgs, GraphFiles, VisibleCommandFileArgs } from "../../MoveMe"
import { LoadType } from "../../Setup/Enums"
import { InstanceBase } from "../../Instance/InstanceBase"
import { ImageDefinition, Image } from "./Image"
import { assertPopulatedString, isTimeRange } from "../../Utility/Is"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"
import { ContentMixin } from "../../Content/ContentMixin"
import { ContainerMixin } from "../../Container/ContainerMixin"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"

const ImageWithTweenable = TweenableMixin(InstanceBase)
const ImageWithContainer = ContainerMixin(ImageWithTweenable)
const ImageWithContent = ContentMixin(ImageWithContainer)
const ImageWithPreloadable = PreloadableMixin(ImageWithContent)
const ImageWithUpdatableSize = UpdatableSizeMixin(ImageWithPreloadable)
export class ImageClass extends ImageWithUpdatableSize implements Image {
  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { visible, time, videoRate } = args
    if (!visible) return commandFiles
    
    const files = this.fileUrls(args)
    const [file] = files
    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const options: ValueObject = { loop: 1, framerate: videoRate }
    if (duration) options.t = duration
    const { id } = this
    const commandFile: CommandFile = { ...file, inputId: id, options }
    // console.log(this.constructor.name, "commandFiles", id)
    commandFiles.push(commandFile)
    return commandFiles
  }

  declare definition: ImageDefinition

  fileUrls(args: GraphFileArgs): GraphFiles { 
    const { visible, editing } = args
    const files: GraphFiles = []
    if (!visible) return files
    
    const { definition } = this
    const { url, source } = definition
    const file = editing ? url : source
    assertPopulatedString(file, editing ? 'url' : 'source')

    const graphFile: GraphFile = {
      input: true, type: LoadType.Image, file, definition
    }
    files.push(graphFile)
    return files
  }
}
