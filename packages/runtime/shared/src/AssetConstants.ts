import type { AssetTypes, AudioType, ImageType, VideoType } from './AssetType.js'

export const AUDIO: AudioType = 'audio'
export const IMAGE: ImageType = 'image'
export const VIDEO: VideoType = 'video'

export const ASSET_TYPES: AssetTypes = [AUDIO, IMAGE, VIDEO]
export const AUDIBLE_TYPES: AssetTypes = [AUDIO, VIDEO]
export const VISIBLE_TYPES: AssetTypes = [IMAGE, VIDEO]

export const ASSET_DURATION = 3
