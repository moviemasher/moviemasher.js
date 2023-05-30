import type { AudioAssetObject } from "../../Shared/Audio/AudioAsset.js"

import { assertImportedAssetObject } from "../../Shared/Imported/ImportedAssetGuards.js"
import { AudibleAssetMixin } from '../../Shared/Audible/AudibleAssetMixin.js'
import { AudibleClientAssetMixin } from "../Audible/AudibleClientAssetMixin.js"
import { ClientAudio } from '../../Helpers/ClientMedia/ClientMedia.js'
import { ClientAudioAsset } from "../ClientTypes.js"
import { AudioClientInstanceClass } from '../Audio/AudioClientInstanceClass.js'
import { ImportedClientAssetClass } from "./ImportedClientAssetClass.js"
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { isDefiniteError } from '../../Shared/SharedGuards.js'
import { AssetCacheArgs, PreloadArgs } from '../../Base/Code.js'
import { TypeAudio } from "@moviemasher/runtime-shared"
import { AudioInstance, AudioInstanceArgs, AudioInstanceObject } from "../../Shared/Audio/AudioInstance.js"
import { AudioAssetMixin } from "../../Shared/Audio/AudioAssetMixin.js"
import { clientMediaAudioPromise } from "../../Helpers/ClientMedia/ClientMediaFunctions.js"
import { isClientImportedAssetObject } from "../Asset/ClientAssetGuards.js"


const WithAudibleAsset = AudibleAssetMixin(ImportedClientAssetClass)
const WithClientAudibleAsset = AudibleClientAssetMixin(WithAudibleAsset)
const WithAudio = AudioAssetMixin(WithClientAudibleAsset)

export class ImportedClientAudioAssetClass extends WithAudio implements ClientAudioAsset {
  constructor(object: AudioAssetObject) {
    assertImportedAssetObject(object)
    super(object)
    if (isClientImportedAssetObject(object)) {
      const { loadedAudio } = object
      if (loadedAudio) this.loadedAudio = loadedAudio
    }
  }
  
  instanceFromObject(object?: AudioInstanceObject | undefined): AudioInstance {
    return new AudioClientInstanceClass(this.instanceArgs(object))
  }

  instanceArgs(object: AudioInstanceObject = {}): AudioInstanceArgs {
    const args = super.instanceArgs(object)
    return { ...args, asset: this }
  }

  get requestPromise(): Promise<void> { return Promise.resolve() }

  assetCachePromise(args: AssetCacheArgs): Promise<void> {
    const { audible } = args
    if (!audible) return Promise.resolve()

    const { loadedAudio } = this
    if (loadedAudio) return Promise.resolve()


    const transcoding = this.preferredAsset(TypeAudio) 
    if (!transcoding) return Promise.resolve()

    const { request } = transcoding
    return clientMediaAudioPromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientAudio } = orError
      this.loadedAudio = clientAudio
    })
  }
  loadedAudio?: ClientAudio
}


