import type { VideoAssetObject } from '../../Shared/Video/VideoAsset.js'
import type { VideoServerAsset } from '../ServerAsset.js'
import type { GraphFile, GraphFiles, PreloadArgs } from '../../Base/Code.js'

import { TypeAudio, TypeVideo } from '@moviemasher/runtime-shared'

import { ServerImportedAssetClass } from './ServerImportedAssetClass.js'
import { assertImportedAssetObject } from "../../Shared/Imported/ImportedAssetGuards.js"
import { assertPopulatedString } from '../../Shared/SharedGuards.js'
import { assertEndpoint, endpointUrl } from '../../Helpers/Endpoint/EndpointFunctions.js'
import { AudibleAssetMixin } from '../../Shared/Audible/AudibleAssetMixin.js'
import { AudibleServerAssetMixin } from '../AudibleServerAssetMixin.js'
import { VisibleAssetMixin } from '../../Shared/Visible/VisibleAssetMixin.js'
import { VisibleServerAssetMixin } from '../VisibleServerAssetMixin.js'
import { VideoAssetMixin } from '../../Shared/Video/VideoAssetMixin.js'

const WithAudibleAsset = AudibleAssetMixin(ServerImportedAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithServerAudibleAsset = AudibleServerAssetMixin(WithVisibleAsset)
const WithServerVisibleAsset = VisibleServerAssetMixin(WithServerAudibleAsset)
const WithVideo = VideoAssetMixin(WithServerVisibleAsset)
export class ServerImportedVideoAssetClass extends WithVideo implements VideoServerAsset {
  constructor(object: VideoAssetObject) {
    assertImportedAssetObject(object)
    super(object)
  }
  graphFiles(args: PreloadArgs): GraphFiles {
    const files: GraphFiles = []

    const { audible, visible } = args

    const { request } = this
    const { endpoint } = request
    assertEndpoint(endpoint)

    const file = endpointUrl(endpoint)

    assertPopulatedString(file)

    if (visible) {
      const visibleGraphFile: GraphFile = {
        input: true, type: TypeVideo, file, definition: this
      }
      files.push(visibleGraphFile)
    }
    if (audible) {
      const mutable = this.duration ? this.audio : true
      if (mutable && !this.muted) {
        const audioGraphFile: GraphFile = {
          input: true, type: TypeAudio, definition: this,
          file: '',
        }
        files.push(audioGraphFile)
      }
    }
    return files
  }

  type = TypeVideo
}

