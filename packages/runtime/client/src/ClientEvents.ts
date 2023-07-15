import type { AssetObjects, DataOrError, MashAsset, Rect, Size, Time } from '@moviemasher/runtime-shared'
import type { MashIndex } from './Masher.js'
import type { PreviewItems, SvgItem, SvgOrImage } from './Svg.js'
import type { ClientAssets } from './ClientAsset.js'
import type { ClientClip, ClientClips, ClientTrack } from './ClientMashTypes.js'

export interface PreviewItemsEventDetail {
  disabled?: boolean
  promise?: Promise<PreviewItems>
}

export type PreviewItemsEvent = CustomEvent<PreviewItemsEventDetail>

export interface MashAddAssetsEventDetail {
  mashIndex?: MashIndex
  assetObjects: AssetObjects
  promise?: Promise<ClientAssets>
}

export type MashAddAssetsEvent = CustomEvent<MashAddAssetsEventDetail>

export type MashMoveClipEvent = CustomEvent<MashIndex>

export interface MashRemoveTrackEventDetail {
  track: ClientTrack
}

export type MashRemoveTrackEvent = CustomEvent<MashRemoveTrackEventDetail>

export type RectEvent = CustomEvent<Rect>


export type TimeEvent = CustomEvent<Time>


export type ClipEvent = CustomEvent<ClientClip>

export type ClipOrFalseEvent = CustomEvent<ClientClip | false>

export type MashAssetEvent = CustomEvent<MashAsset | undefined>

export interface TrackClipsEventDetail {
  trackIndex: number
  clips?: ClientClips
  dense?: boolean
}

export type TrackClipsEvent = CustomEvent<TrackClipsEventDetail>

export interface ScrollRootEventDetail {
  root?: Element
}

export type ScrollRootEvent = CustomEvent<ScrollRootEventDetail>


export interface ClipFromIdEventDetail {
  clipId: string
  clip?: ClientClip
}

export type ClipFromIdEvent = CustomEvent<ClipFromIdEventDetail>

export type SvgOrImageDataOrError = DataOrError<SvgOrImage>

export interface IconFromFrameEventDetail {
  clipSize: Size
  clipId: string
  gap?: number
  scale: number
  promise?: Promise<SvgOrImageDataOrError>
  background?: SVGElement
}

export type IconFromFrameEvent = CustomEvent<IconFromFrameEventDetail>

export interface DroppedEventDetail {
  clip?: ClientClip
  
}
