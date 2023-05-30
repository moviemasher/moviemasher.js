import type { ImageAsset, ImageAssetObject } from "../../Shared/Image/ImageAsset.js"
import type { GraphFile, GraphFiles, PreloadArgs } from '../../Base/Code.js'

import { TypeImage } from '@moviemasher/runtime-shared'

import { assertEndpoint, endpointUrl } from '../../Helpers/Endpoint/EndpointFunctions.js'
import { assertPopulatedString } from '../../Shared/SharedGuards.js'
import { ServerImportedAssetClass } from "./ServerImportedAssetClass.js"
import { assertImportedAssetObject } from "../../Shared/Imported/ImportedAssetGuards.js"
import { VisibleAssetMixin } from '../../Shared/Visible/VisibleAssetMixin.js'
import { VisibleServerAssetMixin } from "../VisibleServerAssetMixin.js"
import { ImageAssetMixin } from '../../Shared/Image/ImageAssetMixin.js'

const WithVisibleAsset = VisibleAssetMixin(ServerImportedAssetClass)
const WithServerVisibleAsset = VisibleServerAssetMixin(WithVisibleAsset)
const WithImage = ImageAssetMixin(WithServerVisibleAsset)

export class ServerImportedImageAssetClass extends WithImage implements ImageAsset {
  constructor(object: ImageAssetObject) {
    assertImportedAssetObject(object)
    super(object)
  }
  // instanceFromObject(object?: ImageInstanceObject | undefined): ImageInstance {
  //   return errorThrow(ErrorName.Unimplemented)
  // }
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
