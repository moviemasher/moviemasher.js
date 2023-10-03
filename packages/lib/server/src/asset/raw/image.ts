import type { GraphFile, GraphFiles } from '@moviemasher/runtime-server'
import type { ImageInstanceObject, InstanceArgs, CacheArgs, RawImageAssetObject, ValueRecord } from '@moviemasher/runtime-shared'
import type { CommandFile, CommandFiles, VisibleCommandFileArgs } from '@moviemasher/runtime-server'
import type { ServerRawImageAsset, ServerRawImageInstance } from '../../Types/ServerRawTypes.js'

import { ImageAssetMixin, ImageInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, assertPopulatedString, isTimeRange } from '@moviemasher/lib-shared'
import { EventServerAsset } from '@moviemasher/runtime-server'
import { RAW, IMAGE, isAssetObject } from '@moviemasher/runtime-shared'
import { ServerRawAssetClass } from '../../Base/ServerRawAssetClass.js'
import { ServerInstanceClass } from '../../Base/ServerInstanceClass.js'
import { ServerVisibleAssetMixin } from '../../Base/ServerVisibleAssetMixin.js'
import { ServerVisibleInstanceMixin } from '../../Base/ServerVisibleInstanceMixin.js'

const WithAsset = VisibleAssetMixin(ServerRawAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithImageAsset = ImageAssetMixin(WithServerAsset)

export class ServerRawImageAssetClass extends WithImageAsset implements ServerRawImageAsset {
  constructor(args: RawImageAssetObject) {
    super(args)
    this.initializeProperties(args)
  }

  assetGraphFiles(args: CacheArgs): GraphFiles {
    const { visible } = args
    const files: GraphFiles = super.assetGraphFiles(args)
    if (!visible) return files

    const { request } = this
    const { path: file } = request
    assertPopulatedString(file)
   
    const graphFile: GraphFile = {
      input: true, type: IMAGE, file, definition: this
    }
    files.push(graphFile)
    return files
  }


  override instanceFromObject(object?: ImageInstanceObject): ServerRawImageInstance {
    const args = this.instanceArgs(object)
    return new ServerRawImageInstanceClass(args)
  }


  type = IMAGE

  static handleAsset(event: EventServerAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, IMAGE, RAW)) {
      detail.asset = new ServerRawImageAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for image/raw asset event
export const ServerRawImageListeners = () => ({
  [EventServerAsset.Type]: ServerRawImageAssetClass.handleAsset
})

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerVisibleInstanceMixin(WithInstance)
const WithImageInstance = ImageInstanceMixin(WithServerInstance)

export class ServerRawImageInstanceClass extends WithImageInstance implements ServerRawImageInstance {
  constructor(args: ImageInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  declare asset: ServerRawImageAsset

  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const commandFiles: CommandFiles = []
    const { visible, time, videoRate } = args
    if (!visible) return commandFiles

    const files = this.asset.assetGraphFiles(args)
    const [file] = files
    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const options: ValueRecord = { loop: 1, framerate: videoRate }
    if (duration) options.t = duration
    const { id } = this
    const commandFile: CommandFile = { ...file, inputId: id, options }
    // console.log(this.constructor.name, 'commandFiles', id)
    commandFiles.push(commandFile)

    return commandFiles
  }
}
