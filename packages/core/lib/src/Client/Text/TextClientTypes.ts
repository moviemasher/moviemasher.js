import { ClientEffects } from '../../Effect/Effect.js'
import { ClientFont, ClientFontDataOrError } from '../../Helpers/ClientMedia/ClientMedia.js'
import { EndpointRequest } from '../../Helpers/Request/Request.js'
import { TextAsset, TextAssetObject, TextInstance } from '../../Shared/Text/TextTypes.js'
import { ClientAsset } from "../ClientTypes.js"
import { ClientInstance } from '../ClientTypes.js'

export interface TextClientAsset extends TextAsset, ClientAsset {

}

export interface TextClientInstance extends TextInstance, ClientInstance {

}
export interface TextClientInstance extends TextInstance, ClientInstance {
  requestFontPromise(request: EndpointRequest): Promise<ClientFontDataOrError> 
  effects: ClientEffects
  asset: TextClientAsset
}

export interface TextClientAssetObject extends TextAssetObject {
  loadedFont?: ClientFont
}