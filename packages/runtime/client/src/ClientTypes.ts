import type { AudibleInstance, AudioAsset, AudioInstance, AudioInstanceObject, ColorAsset, ColorInstance, ContainerInstance, ImageAsset, ImageInstance, ImageInstanceObject, Instance, InstanceArgs, MovieMasherRuntime, PropertySize, Rect, ShapeAsset, ShapeInstance, Size, TextAsset, TextAssetObject, TextInstance, Time, TimeRange, VideoAsset, VideoInstance, VideoInstanceObject, VisibleInstance } from '@moviemasher/runtime-shared'
import type { StartOptions } from './AudioPreview.js'
import type { ClientAsset } from './ClientAsset.js'
import type { ClientAudibleAsset, ClientVisibleAsset } from './ClientAssetTypes.js'
import type { ClientClip } from './ClientMashTypes.js'
import type { ClientFont, MediaRequest } from './ClientMedia.js'
import type { Masher } from './Masher.js'
import type { Panel } from './PanelTypes.js'
import type { RequestObject } from './Requestable.js'
import type { Selectable } from './Selectable.js'
import type { Preview, SvgItem } from './Svg.js'
import type { Transcoding } from './Transcoding.js'

export type Timeout = ReturnType<typeof setTimeout>
export type AnimationFrame = ReturnType<typeof requestAnimationFrame>

export interface ClientInstance extends Instance, Selectable {
  clip: ClientClip
  asset: ClientAsset
  unload(): void
}

export interface ClientAudibleInstance extends ClientInstance, AudibleInstance {
  startOptions(seconds: number, timeRange: TimeRange): StartOptions
  asset: ClientAudibleAsset
  clip: ClientClip
}
export interface ClientVisibleInstance extends ClientInstance, VisibleInstance {
  asset: ClientVisibleAsset
  clip: ClientClip
  containedPreviewPromise(contentItem: SvgItem, content: ClientInstance, containerRect: Rect, size: Size, time: Time, component: Panel): Promise<Preview> 
  clippedPreviewPromise(content: ClientVisibleInstance, containerRect: Rect, previewSize: Size, time: Time, component: Panel): Promise<Preview>
  containerSvgItemPromise(containerRect: Rect, time: Time, component: Panel): Promise<SvgItem>
  contentPreviewItemPromise(containerRect: Rect, shortest: PropertySize, time: Time, component: Panel): Promise<SvgItem>
  contentSvgFilter(container: ContainerInstance, contentItem: SvgItem, outputSize: Size, containerRect: Rect, time: Time, clipTime: TimeRange): SVGFilterElement | undefined
  pathElement(rect: Rect): SvgItem 
  svgItemForPlayerPromise(rect: Rect, time: Time): Promise<SvgItem> 
  svgItemForTimelinePromise(rect: Rect, time: Time): Promise<SvgItem> 

}

export interface ClientAudioAsset extends AudioAsset, ClientAudibleAsset {
  instanceFromObject(object?: AudioInstanceObject): AudioInstance
  instanceArgs(object?: AudioInstanceObject): AudioInstanceObject & InstanceArgs
}

export interface ClientImageAsset extends ImageAsset, ClientVisibleAsset {
  instanceFromObject(object?: ImageInstanceObject): ImageInstance
  instanceArgs(object?: ImageInstanceObject): ImageInstanceObject & InstanceArgs
}

export interface ClientVideoAsset extends VideoAsset, ClientAudibleAsset, ClientVisibleAsset {
  instanceFromObject(object?: VideoInstanceObject): VideoInstance
  instanceArgs(object?: VideoInstanceObject): VideoInstanceObject & InstanceArgs
  previewTranscoding?: Transcoding
}

export interface ClientColorAsset extends ColorAsset, ClientAsset {}

export interface ClientColorInstance extends ColorInstance, ClientInstance {
  clip: ClientClip
  asset: ClientColorAsset
}


export interface ClientShapeAsset extends ShapeAsset, ClientAsset {}

export interface ClientShapeInstance extends ShapeInstance, ClientInstance {
  clip: ClientClip
  asset: ClientShapeAsset
}


export interface ClientTextAsset extends TextAsset, ClientAsset {
  request: MediaRequest
}

export interface ClientTextInstance extends TextInstance, ClientInstance {
  clip: ClientClip
  asset: ClientTextAsset
}

export interface ClientTextAssetObject extends TextAssetObject {
  loadedFont?: ClientFont
}


export interface MovieMasherClientRuntime extends MovieMasherRuntime {
  options: {
    assetObjectOptions?: RequestObject
    assetObjectsOptions?: RequestObject
    iconOptions?: RequestObject
  }
}

