import type { AssetTypes, AudioType, ImageType, VideoType } from './AssetType.js'

export const TypeAudio: AudioType = 'audio'
export const TypeImage: ImageType = 'image'
export const TypeVideo: VideoType = 'video'

export const TypesAsset: AssetTypes = [TypeAudio, TypeImage, TypeVideo]
export const TypesAudible: AssetTypes = [TypeAudio, TypeVideo]
export const TypesVisible: AssetTypes = [TypeImage, TypeVideo]
