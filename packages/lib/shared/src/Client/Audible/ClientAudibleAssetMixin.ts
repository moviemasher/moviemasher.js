import type { ClientAudio, ClientAudioNode } from '../../Helpers/ClientMedia/ClientMedia.js'
import { AudibleContextInstance } from '../Mash/Context/AudibleContext.js'
import { Constrained } from '@moviemasher/runtime-shared'
import { AudibleAsset } from '@moviemasher/runtime-shared'
import { ClientAudibleAsset } from '../Asset/ClientAssetTypes.js'
import { ClientAsset } from "@moviemasher/runtime-client"



export function ClientAudibleAssetMixin
<T extends Constrained<ClientAsset & AudibleAsset>>(Base: T):
T & Constrained<ClientAudibleAsset> {
  return class extends Base implements ClientAudibleAsset {
    audibleSource(): ClientAudioNode | undefined {
      const { loadedAudio } = this
      if (loadedAudio) {
        // console.log(this.constructor.name, 'audibleSource loadedAudio')
        return AudibleContextInstance.createBufferSource(loadedAudio)
      }
    }

    loadedAudio?: ClientAudio

    
  }
}
