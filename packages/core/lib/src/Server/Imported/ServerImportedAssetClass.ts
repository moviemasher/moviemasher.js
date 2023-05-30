import type { ImportedAsset, ImportedAssetObject } from '../../Shared/Imported/ImportedTypes.js'
import type { EndpointRequest } from '../../Helpers/Request/Request.js'

import { ServerAssetClass } from '../ServerAssetClass.js'


export class ServerImportedAssetClass extends ServerAssetClass implements ImportedAsset {
  constructor(object: ImportedAssetObject) {
    super(object)
    const { request } = object
    this.request = request
  }
  
  request: EndpointRequest
}
