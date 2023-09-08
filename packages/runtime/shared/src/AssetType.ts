
export type AudioType = 'audio'
export type ImageType = 'image'
export type VideoType = 'video'

export type AssetType = AudioType | ImageType | VideoType
export type AssetTypes = AssetType[]

export type AudibleType = AudioType | VideoType
export type VisibleType = ImageType | VideoType

export type AssetRecord<T = string> = {
  [key in AssetType]?: T
}
