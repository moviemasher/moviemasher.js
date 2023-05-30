import { ClientFont } from "../../Helpers/ClientMedia/ClientMedia.js"
import { TextAsset, TextAssetObject, TextInstance } from "../../Shared/Text/TextTypes.js"
import { VisibleServerAsset } from "../ServerAsset.js"
import { ServerVisibleInstance } from "../ServerInstance.js"

export interface TextServerAssetObject extends TextAssetObject {
  loadedFont?: ClientFont
}

export interface TextServerAsset extends TextAsset, VisibleServerAsset {
  
}
export interface TextServerInstance extends TextInstance, ServerVisibleInstance {
  asset: TextServerAsset
}