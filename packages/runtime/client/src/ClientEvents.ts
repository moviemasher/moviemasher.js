import type { AssetObjects, Rect, Time } from '@moviemasher/runtime-shared'
import type { MashIndex } from './Masher.js'
import type { PreviewItems } from './Svg.js'
import type { ClientAssets } from './ClientAsset.js'
import type { ClientClip, ClientTrack } from './ClientMashTypes.js'

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

export interface MashMoveClipEventDetail {
  mashIndex?: MashIndex
  clip: ClientClip
}

export type MashMoveClipEvent = CustomEvent<MashMoveClipEventDetail>

export interface MashRemoveTrackEventDetail {
  track: ClientTrack
}

export type MashRemoveTrackEvent = CustomEvent<MashRemoveTrackEventDetail>

export type RectEvent = CustomEvent<Rect>


export type TimeEvent = CustomEvent<Time>


export type ClipEvent = CustomEvent<ClientClip>

export type ClipOrFalseEvent = CustomEvent<ClientClip | false>
