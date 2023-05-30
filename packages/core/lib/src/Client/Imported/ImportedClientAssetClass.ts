import type { EndpointRequest } from '../../Helpers/Request/Request.js'
import { Size } from '@moviemasher/runtime-shared'
import { ImportedAssetObject } from '../../Shared/Imported/ImportedTypes.js'
import { ClientAssetClass } from '../Asset/ClientAssetClass.js'
import { ImportedClientAsset } from './ImportedTypes.js'


export class ImportedClientAssetClass extends ClientAssetClass implements ImportedClientAsset {
 
  definitionIcon(_: Size): Promise<SVGSVGElement> | undefined { return }


  constructor(...args: any[]) {
    const [object] = args as [ImportedAssetObject]
    super(object)

    const { request } = object
    this.request = request
  }
  request: EndpointRequest

}
