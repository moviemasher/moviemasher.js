import { Size, Time } from '@moviemasher/runtime-shared'
import { ClientImage } from '../../Helpers/ClientMedia/ClientMedia.js'
import { ImportedAsset } from '../../Shared/Imported/ImportedTypes.js'

export interface ImportedClientAsset extends ImportedAsset {
}

export interface ImportedClientVideoAsset extends ImportedClientAsset {


  loadedImagePromise(definitionTime: Time, outSize?: Size): Promise<ClientImage>
}

