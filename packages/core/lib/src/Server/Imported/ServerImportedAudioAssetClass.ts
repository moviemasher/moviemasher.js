import type { AudioAssetObject } from "../../Shared/Audio/AudioAsset.js"

import { ServerImportedAssetClass } from "./ServerImportedAssetClass.js"
import { assertImportedAssetObject } from "../../Shared/Imported/ImportedAssetGuards.js"
import { AudioServerAsset } from '../ServerAsset.js'
import { AudibleAssetMixin } from '../../Shared/Audible/AudibleAssetMixin.js'
import { AudibleServerAssetMixin } from "../AudibleServerAssetMixin.js"
import { AudioAssetMixin } from '../../Shared/Audio/AudioAssetMixin.js'

const WithAudibleAsset = AudibleAssetMixin(ServerImportedAssetClass)
const WithServerAudibleAsset = AudibleServerAssetMixin(WithAudibleAsset)
const WithAudio = AudioAssetMixin(WithServerAudibleAsset)

export class ServerImportedAudioAssetClass extends WithAudio implements AudioServerAsset {
  constructor(object: AudioAssetObject) {
    assertImportedAssetObject(object)
    super(object)
  }
}
