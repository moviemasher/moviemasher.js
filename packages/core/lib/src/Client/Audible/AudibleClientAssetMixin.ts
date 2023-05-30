import type { ClientAudio, ClientAudioNode } from '../../Helpers/ClientMedia/ClientMedia.js'
import { AudibleContextInstance } from '../../Context/AudibleContext.js'
import { Constrained } from '../../Base/Constrained.js'
import { AudibleAsset } from '../../Shared/Asset/Asset.js'
import { ClientAudibleAsset } from '../Asset/ClientAsset.js'
import { ClientAsset } from "../ClientTypes.js"



export function AudibleClientAssetMixin
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
