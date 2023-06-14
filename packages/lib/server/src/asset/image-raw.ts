import { 
  CommandFile, CommandFiles,  ImageAssetMixin, 
  ImageInstanceMixin, ServerInstanceClass, ServerRawAssetClass, 
  ServerVisibleAssetMixin, ServerVisibleInstanceMixin, VisibleAssetMixin, 
  VisibleCommandFileArgs, VisibleInstanceMixin, assertEndpoint, 
  assertPopulatedString, endpointUrl, isTimeRange 
} from "@moviemasher/lib-shared"
import { ServerRawImageAsset, ServerRawImageInstance } from "@moviemasher/lib-shared/dist/Server/Raw/ServerRawTypes.js"
import { GraphFiles, GraphFile } from "@moviemasher/runtime-server"
import { PreloadArgs, TypeImage, ValueRecord } from "@moviemasher/runtime-shared"

const WithAsset = VisibleAssetMixin(ServerRawAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithImageAsset = ImageAssetMixin(WithServerAsset)

export class ServerRawImageAssetClass extends WithImageAsset implements ServerRawImageAsset {
 
  graphFiles(args: PreloadArgs): GraphFiles {
    const { visible } = args
    const files: GraphFiles = super.graphFiles(args)
    if (!visible)
      return files

    const { request } = this
    const { endpoint } = request
    assertEndpoint(endpoint)
    const file = endpointUrl(endpoint)
    if (!file)
      console.log(this.constructor.name, 'graphFiles', request)
    assertPopulatedString(file)

    const graphFile: GraphFile = {
      input: true, type: TypeImage, file, definition: this
    }
    files.push(graphFile)
    return files
  }

  type = TypeImage
}

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerVisibleInstanceMixin(WithInstance)
const WithImageInstance = ImageInstanceMixin(WithServerInstance)

export class ServerImageInstanceClass extends WithImageInstance implements ServerRawImageInstance {
  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { visible, time, videoRate } = args
    if (!visible)
      return commandFiles

    const files = this.graphFiles(args)
    const [file] = files
    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const options: ValueRecord = { loop: 1, framerate: videoRate }
    if (duration)
      options.t = duration
    const { id } = this
    const commandFile: CommandFile = { ...file, inputId: id, options }
    // console.log(this.constructor.name, 'commandFiles', id)
    commandFiles.push(commandFile)

    return commandFiles
  }

  declare asset: ServerRawImageAsset
}
