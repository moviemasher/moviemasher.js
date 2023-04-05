import type { 
  UpdatableDuration, UpdatableDurationDefinition, 
  UpdatableDurationDefinitionObject, UpdatableDurationObject 
} from '../../Mixin/UpdatableDuration/UpdatableDuration.js'
import type { Content, ContentObject } from '../Content/Content.js'
import type { Media, MediaObject } from '../Media.js'
import type { AudioType } from '../../Setup/Enums.js'

import { isContent } from '../Content/ContentFunctions.js'
import { TypeAudio } from '../../Setup/Enums.js'
import { isMedia } from '../MediaFunctions.js'

export interface AudioObject extends ContentObject, UpdatableDurationObject {
  definition?: AudioMedia
}

export interface Audio extends Content, UpdatableDuration {
  definition : AudioMedia
}
export const isAudio = (value: any): value is Audio => {
  return isContent(value) && isAudioMedia(value.definition)
}

export interface AudioMediaObject extends MediaObject, UpdatableDurationDefinitionObject { 
}

/**
 * @category Media
 */
export interface AudioMedia extends Media, UpdatableDurationDefinition {
  type: AudioType
  instanceFromObject(object?: AudioObject): Audio
}

export const isAudioMedia = (value: any): value is AudioMedia => {
  return isMedia(value) && value.type === TypeAudio
}
