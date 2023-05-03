import type {Rect, RectOptions} from '../../Utility/Rect.js'
import type {Time, TimeRange} from '../../Helpers/Time/Time.js'
import type {ValueRecord} from '../../Types/Core.js'
import type {SvgItem} from '../../Helpers/Svg/Svg.js'
import type {CommandFile, CommandFiles, GraphFile, PreloadArgs, GraphFiles, VisibleCommandFileArgs} from '../../Base/Code.js'
import type {ImageMedia, Image} from './Image.js'
import {TypeImage} from '../../Setup/Enums.js'
import {assertPopulatedString, isDefiniteError, isTimeRange} from '../../Utility/Is.js'
import {UpdatableSizeMixin} from '../../Mixin/UpdatableSize/UpdatableSizeMixin.js'
import {ContentMixin} from '../Content/ContentMixin.js'
import {ContainerMixin} from '../Container/ContainerMixin.js'
import {TweenableMixin} from '../../Mixin/Tweenable/TweenableMixin.js'
import {MediaInstanceBase} from '../MediaInstanceBase.js'
import {svgImagePromiseWithOptions} from '../../Helpers/Svg/SvgFunctions.js'
import {assertEndpoint, endpointUrl} from '../../Helpers/Endpoint/EndpointFunctions.js'
import {errorThrow} from '../../Helpers/Error/ErrorFunctions.js'

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
    // console.log(this.constructor.name, 'commandFiles', id)
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
    if (!file) console.log(this.constructor.name, 'graphFiles', request)
    assertPopulatedString(file)

    const graphFile: GraphFile = {
      input: true, type: TypeImage, file, definition
    }
    files.push(graphFile)
    return files
  }

  svgItemForTimelinePromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> {
    const { definition } = this
    const requestable = definition.preferredTranscoding(TypeImage)
    const { request } = requestable
    return this.definition.requestImagePromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      const { src } = clientImage
      const svgImageOptions: RectOptions = { ...rect }
      return svgImagePromiseWithOptions(src, svgImageOptions)
    })
  }
}
