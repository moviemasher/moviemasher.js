import { TypeAudio } from "@moviemasher/runtime-shared"
import { Constrained } from "../../Base/Constrained.js"
import { AudibleAsset } from "../Asset/Asset.js"
import { AudioAsset } from "./AudioAsset.js"

export function AudioAssetMixin
<T extends Constrained<AudibleAsset>>(Base: T): 
T & Constrained<AudioAsset> {
  return class extends Base implements AudioAsset {
    type = TypeAudio 
  }
}